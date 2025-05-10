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

export const getTeacherAssignmentsDashboard = async (teacherId) => {
  const key = `teacherAssignmentsDashboard_${teacherId}`;
  const url = `${API_URL}/api/teacher/dashboard/${teacherId}/assignments`;
  return fetchWithCache(key, url);
};

export const getAllClasses = async () => {
  const key = `classList`;
  const url = `${API_URL}/api/teacher/dashboard/classes`; 
  return fetchWithCache(key, url);
};


export const getClassExamMarks = async (classId, examYear) => {
  const key = `classExamMarks_${classId}_${examYear}`;
  const url = `${API_URL}/api/teacher/dashboard/${classId}/${examYear}/exam-marks`;
  return fetchWithCache(key, url);
};

export const getStudentProgress = async (classId, year) => {
  const key = `studentProgress_${classId}_${year}`;
  const url = `${API_URL}/api/teacher/dashboard/${classId}/progress?year=${year}`;
  return fetchWithCache(key, url);
};

export const getWeeklyAttendance = async (classId, year = new Date().getFullYear(), weekNum = new Date().getIsocalendar()[1]) => {
  const key = `weeklyAttendance_${classId}_${year}_${weekNum}`;
  const url = `${API_URL}/api/teacher/dashboard/weekly_attendance?class_id=${classId}&year=${year}&week_num=${weekNum}`;
  return fetchWithCache(key, url);
};