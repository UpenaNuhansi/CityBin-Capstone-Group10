import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Change to your backend URL if deployed
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
