import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const sendQuery = async (query: string) => {
  const response = await axios.post(`${API_BASE_URL}/query`, { query });
  return response.data;
};
