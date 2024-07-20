import React, { useState, useEffect, useRef } from 'react';
import * as FroggerService from '../services/froggerService'; // Asegúrate de tener la ruta correcta
import p5 from 'p5'; // Importar p5.js

const PaintTest = () => {
    const [gameState, setGameState] = useState(null);
    const canvasRef = useRef(null); // Referencia al elemento canvas
    const p5Instance = useRef(null); // Referencia al objeto p5.js

    // Función para obtener el estado del juego desde el servidor
    const fetchGameState = async () => {
        try {
            const gameStateData = await FroggerService.getGameState();
            console.log('Game state fetched:', gameStateData); // Verificar datos recibidos del servidor
            setGameState(gameStateData);
        } catch (error) {
            console.error('Error fetching game state:', error);
        }
    };

    // useEffect para inicializar p5.js una vez
    useEffect(() => {
        if (gameState && canvasRef.current && !p5Instance.current) {
            console.log('Initializing p5 with gameState:', gameState); // Verificar gameState antes de inicializar p5

            // Inicializar p5.js una vez cuando gameState esté disponible y canvasRef exista
            p5Instance.current = new p5(sketch, canvasRef.current);
        }

        // Limpiar p5Instance.current en el cleanup de useEffect
        return () => {
            if (p5Instance.current) {
                p5Instance.current.remove(); // Remover la instancia de p5.js al desmontar el componente
                p5Instance.current = null;
            }
        };
    }, [gameState]);

    // useEffect para actualizar el estado del juego periódicamente
    useEffect(() => {
        const interval = setInterval(fetchGameState, 1000 / 60); // Actualizar 60 veces por segundo
        return () => clearInterval(interval);
    }, []);

    // useEffect para iniciar el bucle de dibujo continuo
    useEffect(() => {
        const animate = () => {
            if (p5Instance.current) {
                p5Instance.current.redraw(); // Volver a dibujar con las nuevas posiciones
                requestAnimationFrame(animate);
            }
        };
        animate();

        // Limpiar el bucle de animación en el cleanup
        return () => cancelAnimationFrame(animate);
    }, []);

    const sketch = (p) => {
        p.setup = () => {
            p.createCanvas(800, 600);
            p.noLoop(); // Desactiva el bucle de dibujo automático, llamaremos a redraw manualmente
        };

        p.draw = () => {
            p.background(255); // Fondo blanco, ajusta según necesites

            // Verificar que gameState esté definido y tenga carLanes y logLanes
            if (gameState && gameState.carLanes && gameState.logLanes) {
                console.log('Drawing cars:', gameState.carLanes); // Verificar carLanes antes de dibujar
                console.log('Drawing logs:', gameState.logLanes); // Verificar logLanes antes de dibujar

                // Dibujar autos
                gameState.carLanes.forEach((lane) => {
                    if (lane.cars) {
                        lane.cars.forEach((car) => {
                            p.fill(255, 0, 0); // Color rojo para los autos, ajusta según diseño
                            p.rect(car.x, car.y, 50, 25); // Tamaño del auto (ancho: 50, alto: 25)
                        });
                    }
                });

                // Dibujar troncos
                gameState.logLanes.forEach((lane) => {
                    if (lane.logs) {
                        lane.logs.forEach((log) => {
                            p.fill(0, 0, 255); // Color azul para los troncos, ajusta según diseño
                            p.rect(log.x, log.y, 100, 25); // Tamaño del tronco (ancho: 100, alto: 25)
                        });
                    }
                });
            }
        };
    };

    return <div ref={canvasRef} />;
};

export default PaintTest;
