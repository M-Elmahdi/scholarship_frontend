import axios from 'axios';

/*
  Droplet: api-scholarship.limu.edu.ly/api
  Local: localhost:8000/api
* */

// const API_URL = process.env.API_URL || 'api-scholarship.limu.edu.ly/api';

export default axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('IS-token')}`,
  },
});
