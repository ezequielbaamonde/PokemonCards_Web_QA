import axios from 'axios';


const API = axios.create({
  baseURL: '/api', //URL base de la API
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true, // Si usás cookies o tokens en headers
});

export default API;