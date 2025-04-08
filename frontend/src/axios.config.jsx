// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://follow-along-yi6s.onrender.com', // your server
    withCredentials: true,            // crucial for sending cookies
});

export default instance;