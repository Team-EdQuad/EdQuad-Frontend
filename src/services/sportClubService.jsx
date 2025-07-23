import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL; 

const CACHE_DURATION = 0.5 * 60 * 1000; 

const fetchWithCache = async (key, url, params = null) => {
  const cached = localStorage.getItem(key);
  const now = Date.now();

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (now - timestamp < CACHE_DURATION) {
      return data;
    } else {
      localStorage.removeItem(key); 
    }
  }

  try {
    const response = await axios.get(url, { params });
    localStorage.setItem(key, JSON.stringify({ data: response.data, timestamp: now }));
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}`, error);
    throw error;
  }
};


export const getAllClubs = async () => {
  const key = `allClubs`;
  const url = `${API_URL}/api/nonacademic/clubs`;
  return fetchWithCache(key, url);
};

export const getAllSports = async () => {
  const key = `allSports`;
  const url = `${API_URL}/api/nonacademic/sports`;
  return fetchWithCache(key, url);
};