import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

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

export const getTeacherAssignementsDashboard = async (studentId, classId) => {
  const key = `teacherAssignmentsDashboard_${teacherId}`;
  const url = `${API_URL}//api/teacher/dashboard/${teacher_id}/assignments`;
  return fetchWithCache(key, url);
};
