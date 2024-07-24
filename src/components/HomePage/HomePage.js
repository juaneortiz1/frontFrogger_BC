import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createSession, addFrog, getSessionId } from '../../services/froggerService';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const [sessionExists, setSessionExists] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const sessionId = await getSessionId();
                if (sessionId !== "-1") {
                    setSessionExists(true);
                    localStorage.setItem('sessionId', sessionId); // Guardar sessionId existente
                }
            } catch (error) {
                console.error('Error checking session:', error);
            }
        };

        checkSession();
    }, []);

    const handleStartGame = async () => {
        try {
            const sessionId = await createSession();
            localStorage.setItem('sessionId', sessionId);
            localStorage.setItem('frogId', 1); // La primera rana siempre será frogId = 1
            navigate('/game');
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    const handleJoinGame = async () => {
        try {
            const sessionId = localStorage.getItem('sessionId');
            const frogId = await addFrog(sessionId);
            localStorage.setItem('frogId', frogId);
            navigate('/game');
        } catch (error) {
            console.error('Error adding frog:', error);
        }
    };

    return (
        <div className="home">
            <h1>Bienvenido a Frogger Battle Royale</h1>
            {sessionExists ? (
                <button className="start-button" onClick={handleJoinGame}>Unirse al Juego</button>
            ) : (
                <button className="start-button" onClick={handleStartGame}>Iniciar Juego</button>
            )}
            <Link to="/login">Log out</Link>
        </div>
    );
};

export default HomePage;
