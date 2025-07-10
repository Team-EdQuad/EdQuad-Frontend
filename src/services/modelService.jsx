import axios from 'axios';

// const API_URL = 'http://127.0.0.1:8000';
const API_URL = import.meta.env.VITE_BACKEND_URL; 

const CACHE_DURATION = 0.5 * 60 * 1000; // 1 minutes in milliseconds

const fetchWithCache = async (key, url, params = null) => {
  const cached = localStorage.getItem(key);
  const now = Date.now();

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (now - timestamp < CACHE_DURATION) {
      return data;
    } else {
      localStorage.removeItem(key); // Clear expired cache
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


export const getPerformancePrediction = async (studentId, classId) => {
  const key = `performancePrediction_${studentId}_${classId}`;
  const url = `${API_URL}/api/dashboard/${studentId}/${classId}/model-features`;
  return fetchWithCache(key, url);
};

export const getPerformanceFeedback = async (studentId, classId) => {
  const key = `performanceFeedback_${studentId}_${classId}`;
  const url = `${API_URL}/api/dashboard/${studentId}/${classId}/model-feedback`;
  const data = await fetchWithCache(key, url);
  return data.feedback;
};