import axios from 'axios';

const API_URL = 'http://localhost:8080/api/game';

export const getGameState = async (sessionId) => {
    try {
        const response = await axios.get(`${API_URL}/state/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching game state:', error);
        return null;
    }
};

export const moveFrog = async (sessionId, frogId, direction) => {
    try {
        const response = await axios.post(`${API_URL}/move/${sessionId}/${frogId}/${direction}`);
        return response.data;
    } catch (error) {
        console.error('Error moving frog:', error);
        throw error;
    }
};

export const addFrog = async (sessionId) => {
    try {
        const response = await axios.post(`${API_URL}/addFrog/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error adding frog:', error);
        throw error;
    }
};


export const restartGame = async (sessionId) => {
    try {
        await axios.post(`${API_URL}/restart/${sessionId}`);
    } catch (error) {
        console.error('Error restarting game:', error);
    }
};

export const getSessionId = async () => {
    try {
        const response = await axios.get(`${API_URL}/session`);
        return response.data.sessionId;
    } catch (error) {
        console.error('Error fetching session ID:', error);
        return null;
    }
};

export const createSession = async () => {
    try {
        const response = await axios.post(`${API_URL}/createSession`);
        return response.data;
    } catch (error) {
        console.error('Error creating session:', error);
        throw error;
    }
};

export const deleteFrogs = async (sessionId) => {
    try {
        const response = await axios.delete(`${API_URL}/deleteFrogs/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting frogs:', error);
        throw error; 
    }
};
