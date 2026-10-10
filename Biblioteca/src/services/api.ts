import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://6ac95538fd7c536b1bdaabb9.mockapi.io/api/biblioteca',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

