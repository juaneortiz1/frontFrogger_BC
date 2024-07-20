import React, { useEffect, useRef, useState } from 'react';
import { getGameState, moveFrog, restartGame } from '../../services/froggerService';
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
    }, [frogRight, frogLeft, frogUp, frogDown, lilyPad, car1Left, car1Right]);

    useEffect(() => {
        const fetchData = async () => {
            const state = await getGameState();
            setGameState(state);
        };

        fetchData();
    }, []);

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
            await moveFrog(direction);
            const updatedState = await getGameState();
            setGameState(updatedState);
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const fetchGameState = async () => {
            const state = await getGameState();
            setGameState(state);
        };

        let animationFrameId;

        const animate = () => {
            fetchGameState();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

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

        // Dibujar elementos estáticos una vez al cargar
        drawStaticElements();

        // Función para dibujar los elementos dinámicos (autos y troncos)
        const drawDynamicElements = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawStaticElements(); // Redibujar los elementos estáticos

            if (gameState && gameState.frog) {
                const { frog } = gameState;

                // Verificar colisión con autos aquí
                gameState.carLanes.forEach((lane) => {
                    if (lane.cars) {
                        lane.cars.forEach((car) => {
                            // Detectar colisión entre la posición de la rana y los autos
                            if (frog.x < car.x + 50 && frog.x + 50 > car.x && frog.y < car.y + 25 && frog.y + 25 > car.y) {
                                handleCollision(); // Llamar a handleCollision en caso de colisión
                            }
                        });
                    }
                });

                // Dibujar la rana basada en la dirección actual
                switch (frog.direction) {
                    case 3:
                        ctx.drawImage(frogUp, frog.x, frog.y);
                        break;
                    case 1:
                        ctx.drawImage(frogRight, frog.x, frog.y);
                        break;
                    case 2:
                        ctx.drawImage(frogDown, frog.x, frog.y);
                        break;
                    case 0:
                        ctx.drawImage(frogLeft, frog.x, frog.y);
                        break;
                    default:
                        break;
                }
            }

            if (gameState && gameState.carLanes) {
                gameState.carLanes.forEach((lane) => {
                    if (lane.cars) {
                        lane.cars.forEach((car) => {
                            let carImg = car1Left; // Imagen por defecto para autos moviéndose a la izquierda
                            if (lane.direction === 1) { // Si el carril va a la derecha, usar imagen de carro a la derecha
                                carImg = car1Right;
                            }

                            ctx.drawImage(carImg, car.x, car.y);
                        });
                    }
                });
            }

            if (gameState && gameState.logLanes) {
                gameState.logLanes.forEach((lane) => {
                    if (lane.logs) {
                        lane.logs.forEach((log) => {
                            ctx.fillStyle = 'blue';
                            ctx.fillRect(log.x, log.y, 100, 25);
                        });
                    }
                });
            }

            // Dibujar vidas
            if (gameState && gameState.lives !== undefined) {
                ctx.fillStyle = 'white';
                ctx.font = '20px Arial';
                ctx.fillText(`Lives: ${gameState.lives}`, 10, 400);

                // Reiniciar el juego si las vidas llegan a 0
                if (gameState.lives === 0) {
                    setShowModal(true); // Mostrar modal de reinicio
                }
            }
        };

        let animationFrameId;

        const animate = () => {
            drawDynamicElements();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [gameState, frogRight, frogLeft, frogUp, frogDown, lilyPad, car1Left, car1Right]);

    const handleCollision = async () => {
        await moveFrog(-1); // Indicar al backend que hubo colisión
        const updatedState = await getGameState();
        setGameState(updatedState); // Actualizar el estado después de la colisión
    };

    const handleRestartGame = async () => {
        await restartGame(); // Reiniciar el juego llamando al backend
        setShowModal(false); // Ocultar modal después del reinicio
    };

    return (
        <>
            <canvas ref={canvasRef} width={700} height={450} />
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Game Over!</h2>
                            <p>Do you want to play again?</p>
                            <button onClick={handleRestartGame}>Yes</button>
                            <button onClick={() => setShowModal(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GameCanvas;

