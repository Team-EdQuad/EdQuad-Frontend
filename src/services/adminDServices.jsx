import axios from 'axios';

// const API_URL = 'http://127.0.0.1:8000';
const API_URL = import.meta.env.VITE_BACKEND_URL; // Use this if you have a VITE environment variable set

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
  const cacheKey = `user_profiles_${searchWithId}_${role}_${classId}`;
  return await fetchWithCache(cacheKey, endpoint, params);
};


export const getAllClasses = async () => {
  const key = `classList`;
  const url = `${API_URL}/api/teacher/dashboard/classes`; 
  return fetchWithCache(key, url);
};

export const getAccessProfile = async (userId) => {
  const endpoint = `${API_URL}/api/admin/dashboard/admin-access-profile`;
  const params = { user_id: userId };

  const url = new URL(endpoint);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Error fetching user profile: ${response.statusText}`);
  }
  return await response.json();
};
