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

export const getAdminStats = async () => {
  const endpoint = `${API_URL}/api/admin/dashboard/stats`;
  return await fetchWithCache('admin_stats', endpoint);
};

export const getUserProfiles = async (searchWithId = "", role = "", classId = "") => {
  const endpoint = `${API_URL}/api/admin/dashboard/users`;
  const params = {
    search_with_id: searchWithId || undefined,
    role: role || undefined,
    class_id: classId || undefined,
  };
  return await fetchWithCache("user_profiles", endpoint, params);
};


export const getAllClasses = async () => {
  const key = `classList`;
  const url = `${API_URL}/api/teacher/dashboard/classes`; 
  return fetchWithCache(key, url);
};