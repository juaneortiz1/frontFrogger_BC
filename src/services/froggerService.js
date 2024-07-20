// froggerService.js

import axios from 'axios';

const baseURL = 'http://localhost:8080/api';

export const getGameState = async () => {
    try {
        const response = await axios.get(`${baseURL}/game/state`);
        return response.data;
    } catch (error) {
        console.error('Error fetching game state:', error);
        throw error; // Propagate the error
    }
};

export const moveFrog = async (direction) => {
    try {
        const response = await axios.post(`${baseURL}/game/move/${direction}`);
        return response.data;
    } catch (error) {
        console.error('Error moving frog:', error);
        throw error; // Propagate the error
    }
};

export const restartGame = async () => {
    try {
        const response = await axios.post(`${baseURL}/game/restart`);
        return response.data;
    } catch (error) {
        console.error('Error restarting game:', error);
        throw error; // Propagate the error
    }
};
