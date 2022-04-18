import axios from 'axios';

/*
  Droplet: https://api-scholarship.limu.edu.ly/api
  Local: http://localhost:8000/api
* */

const API_URL = process.env.API_URL || 'http://127.0.0.1:8000/api/';

export default axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('IS-token')}`,
  },
});
