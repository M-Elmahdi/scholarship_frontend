import axios from 'axios';

const API_URL = process.env.API_URL || 'https://scholarship.limu.edu.ly:8080/api/';

export default axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('IS-token')}`,
  },
});
