import React, { useEffect, useRef, useState } from 'react';
import { moveFrog, restartGame, getGameState, addFrog, createSession, deleteFrogs } from '../../services/froggerService';
import FrogRightImg from '../../assets/FrogRight.png';
import FrogLeftImg from '../../assets/FrogLeft.png';
import FrogUpImg from '../../assets/FrogUp.png';
import FrogDownImg from '../../assets/FrogDown.png';
import LilyPadImg from '../../assets/lilyPad.png';
import Car1LeftImg from '../../assets/Car1-Left.png';
import Car1RightImg from '../../assets/Car1-Right.png';

const GameCanvas = () => {
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [frogId, setFrogId] = useState(localStorage.getItem('frogId') || null); // Obtener frogId de localStorage
    const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || null); // Obtener sessionId de localStorage
    const [timeLeft, setTimeLeft] = useState(60); // Agregar estado para el temporizador

    // Load images
    const frogRight = useRef(new Image()).current;
    const frogLeft = useRef(new Image()).current;
    const frogUp = useRef(new Image()).current;
    const frogDown = useRef(new Image()).current;
    const lilyPad = useRef(new Image()).current;
    const car1Left = useRef(new Image()).current;
    const car1Right = useRef(new Image()).current;

    useEffect(() => {
        frogRight.src = FrogRightImg;
        frogLeft.src = FrogLeftImg;
        frogUp.src = FrogUpImg;
        frogDown.src = FrogDownImg;
        lilyPad.src = LilyPadImg;
        car1Left.src = Car1LeftImg;
        car1Right.src = Car1RightImg;
    }, []);

    useEffect(() => {
        const initGame = async () => {
            if (!sessionId) {
                const newSession = await createSession();
                setSessionId(newSession.sessionId);
                localStorage.setItem('sessionId', newSession.sessionId);
                setTimeLeft(60);
            }
            if (!frogId) {
                const newFrogId = await addFrog(sessionId);
                setFrogId(newFrogId);
                localStorage.setItem('frogId', newFrogId);
            }
        };

        initGame();
    }, [sessionId, frogId]);

    useEffect(() => {
        const fetchData = async () => {
            const state = await getGameState(sessionId);
            setGameState(state);
        };

        fetchData();
    }, [sessionId]);

    useEffect(() => {
        const handleKeyDown = async (event) => {
            let direction;
            switch (event.key) {
                case 'w':
                    direction = 3; // Frog.UP
                    break;
                case 'd':
                    direction = 1; // Frog.RIGHT
                    break;
                case 's':
                    direction = 2; // Frog.DOWN
                    break;
                case 'a':
                    direction = 0; // Frog.LEFT
                    break;
                default:
                    return;
            }

            console.log(`Direction pressed: ${direction}`);
            console.log(`SessionId: ${sessionId}`);
            console.log(`FrogId: ${frogId}`); // Agregar información del frogId

            try {
                await moveFrog(sessionId, frogId, direction);
                const updatedState = await getGameState(sessionId);
                setGameState(updatedState);
            } catch (error) {
                console.error("Error moving frog: ", error);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [sessionId, frogId]); // Agregar frogId a las dependencias

    useEffect(() => {
        const fetchGameState = async () => {
            const state = await getGameState(sessionId);
            setGameState(state);
        };

        let animationFrameId;

        const animate = () => {
            fetchGameState();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [sessionId]);

    // Nueva función handleCollision
    const handleCollision = async () => {
        if (!frogId || !sessionId) return;

        try {
            await moveFrog(sessionId, frogId, -1); // Envía una solicitud POST con dirección -1 para reiniciar la posición
            const updatedState = await getGameState(sessionId);
            setGameState(updatedState);
        } catch (error) {
            console.error("Error handling collision: ", error);
        }
    };

    // Nueva función handleLilyPad
    const handleLilyPad = async () => {
        if (!frogId || !sessionId) return;

        try {
            await moveFrog(sessionId, frogId, -2); // Envía una solicitud POST con dirección -2 para incrementar el score
            const updatedState = await getGameState(sessionId);
            setGameState(updatedState);
        } catch (error) {
            console.error("Error handling lilypad: ", error);
        }
    };

    // Nueva función para manejar el reinicio del juego
    const handleGameOver = async () => {
        try {
            
            await restartGame(sessionId); // Reiniciar el juego
           
            localStorage.removeItem('frogId'); // Limpiar frogId del localStorage
            localStorage.removeItem('sessionId'); // Limpiar sessionId del localStorage
            window.location.href = '/'; // Redirigir a la página principal
            await deleteFrogs(sessionId); // Eliminar todas las ranas de la sesión
        } catch (error) {
            console.error("Error restarting game: ", error);
        }
    };

    useEffect(() => {
        // Temporizador
        if (timeLeft <= 0) {
            handleGameOver();
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Función para dibujar el fondo estático
        const drawStaticElements = () => {
            ctx.fillStyle = 'green';
            ctx.fillRect(0, 0, canvas.width, canvas.height); // fill the background

            ctx.fillStyle = 'blue';
            ctx.fillRect(0, 65, canvas.width, 190);

            ctx.fillStyle = 'blue';
            ctx.fillRect(60, 20, 70, 50);
            ctx.fillRect(240, 20, 70, 50);
            ctx.fillRect(420, 20, 70, 50);
            ctx.fillRect(600, 20, 70, 50);

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 75);
            ctx.lineTo(canvas.width, 75);
            ctx.moveTo(0, 275);
            ctx.lineTo(canvas.width, 275);
            ctx.stroke();

            ctx.fillStyle = 'gray';
            ctx.fillRect(0, 76, canvas.width, 199);

            ctx.fillStyle = 'black';
            ctx.fillRect(0, canvas.height - 100, canvas.width, 300);

            ctx.fillStyle = 'yellow';
            for (let y = 116; y < 264; y += 39) {
                for (let x = 10; x < canvas.width - 10; x += 90) {
                    ctx.fillRect(x, y, 60, 4);
                }
            }

            ctx.drawImage(lilyPad, 75, 30);
            ctx.drawImage(lilyPad, 254, 30);
            ctx.drawImage(lilyPad, 434, 30);
            ctx.drawImage(lilyPad, 614, 30);
        };

        // Función para dibujar los elementos dinámicos (autos y troncos)
        const drawDynamicElements = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawStaticElements(); // Redibujar los elementos estáticos

            if (gameState && gameState.frogs) {
                // Dibujar cada rana en la lista de ranas
                gameState.frogs.forEach(frog => {
                    let frogImage;
                    switch (frog.direction) {
                        case 0: // Frog.LEFT
                            frogImage = frogLeft;
                            break;
                        case 1: // Frog.RIGHT
                            frogImage = frogRight;
                            break;
                        case 2: // Frog.DOWN
                            frogImage = frogDown;
                            break;
                        case 3: // Frog.UP
                            frogImage = frogUp;
                            break;
                        default:
                            frogImage = frogUp;
                            break;
                    }
                    ctx.drawImage(frogImage, frog.x, frog.y, 50, 50);

                    // Verificar colisión con autos aquí
                    if (gameState.carLanes) {
                        gameState.carLanes.forEach(lane => {
                            if (lane.cars) {
                                lane.cars.forEach(car => {
                                    // Detectar colisión entre la posición de la rana y los autos
                                    if (frog.x < car.x + 50 && frog.x + 50 > car.x && frog.y < car.y + 25 && frog.y + 25 > car.y) {
                                        handleCollision(); // Llamar a handleCollision en caso de colisión
                                    }
                                });
                            }
                        });
                    }

                    // Verificar si la rana está en un lilypad
                    if (
                        (frog.x >= 60 && frog.x <= 130 && frog.y <= 50) ||
                        (frog.x >= 240 && frog.x <= 310 && frog.y <= 50) ||
                        (frog.x >= 420 && frog.x <= 490 && frog.y <= 50) ||
                        (frog.x >= 600 && frog.x <= 670 && frog.y <= 50)
                    ) {
                        handleLilyPad(); // Llamar a handleLilyPad en caso de que la rana esté en un lilypad
                    }
                });
            }

            if (gameState && gameState.carLanes) {
                // Dibujar autos
                gameState.carLanes.forEach(lane => {
                    if (lane.cars) { // Verificar que 'lane.cars' esté definido
                        lane.cars.forEach(car => {
                            let carImage = car.direction === 0 ? car1Left : car1Right;
                            ctx.drawImage(carImage, car.x, car.y, 50, 50);
                        });
                    }
                });
            }

            if (gameState && gameState.logLanes) {
                // Dibujar troncos
                gameState.logLanes.forEach(lane => {
                    if (lane.logs) { // Verificar que 'lane.logs' esté definido
                        lane.logs.forEach(log => {
                            ctx.fillStyle = 'brown';
                            ctx.fillRect(log.x, log.y, log.width, log.height);
                        });
                    }
                });
            }

            // Dibujar el score (vidas) en la esquina inferior izquierda
            if (gameState && gameState.lives !== undefined) {
                ctx.fillStyle = 'white';
                ctx.font = '24px Arial';
                ctx.fillText(`Score: ${gameState.lives}`, 10, canvas.height - 10); // Ajusta la posición y el estilo según lo necesites
            }

            // Dibujar el temporizador en la esquina inferior derecha
            ctx.fillStyle = 'white';
            ctx.font = '24px Arial';
            ctx.fillText(`Time: ${timeLeft}s`, canvas.width - 150, canvas.height - 10); // Ajusta la posición y el estilo según lo necesites

            // Verificar si el puntaje es mayor a 10,000 y reiniciar el juego
            if (gameState && gameState.lives >= 10000) {
                handleGameOver();
            }
        };

        drawDynamicElements();

        let animationFrameId;

        const animate = () => {
            drawDynamicElements();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [gameState, timeLeft]);

    return (
        <div>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Game Over</h2>
                        <button onClick={() => {
                            restartGame(sessionId);
                            setShowModal(false);
                        }}>Restart</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameCanvas;
