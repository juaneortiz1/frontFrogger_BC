import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home">
            <h1>Bienvenido a Frogger Battle Royale</h1>
            <Link to="/game" className="start-button">Iniciar Juego</Link>
            <Link to="/test">Go to Test Page</Link>
        </div>
    );
};

export default HomePage;
