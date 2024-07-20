import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage/HomePage';
import GamePage from './components/GamePage/GamePage';
import TestPage from './components/PaintTest';

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/game" element={<GamePage />} />
                    <Route path="/test" element={<TestPage />} /> 
                </Routes>
            </div>
        </Router>
    );
}

export default App;
