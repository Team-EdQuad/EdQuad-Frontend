// import axios from 'axios';

// export const getSubjectProgress = async (studentId, classId) => {
//     const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/progress`);
//     return response.data;

// };

// export const getStudentAssignments = async (studentId, classId) => {
//     const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/assignments`);
//     return response.data;
//   };
  
//   export const getFilteredAssignments = async (studentId, classId, status) => {
//     const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/assignments/filterByStatus`, {
//       params: { status }
//     });
//     return response.data;
//   };
  
//   export const getSortedAssignments = async (studentId, classId, status = null) => {
//     const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/assignments/filterByDate`, {
//       params: { status }
//     });
//     return response.data;
//   };

//   export const getStudentExamMarks = async (studentId, classId, examYear) => {
//     const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/exam-marks`);
//     return response.data;
//   };
  
//   export const getMonthlyAttendanceRate = async (studentId, classId) => {
//     const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/mothlyAttendanceRate`);
//     return response.data;
//   };
  
//   export const getWeeklyAttendanceRate = async (studentId, classId) => {
//     const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/weeklyAttendanceRate`);
//     return response.data;
//   };

//   export const getAttendanceRate = async (studentId, classId) => {
//     const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/academicAttendanceRate`);
//     return response.data;
//   };

  // export const getNonacademicAttendance = async (studentId, classId) => {
  //   const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/nonacademic-attendance`);
  //   return response.data;
  // };


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

export const getSubjectProgress = async (studentId, classId) => {
  const key = `subjectProgress_${studentId}_${classId}`;
  const url = `${API_URL}/api/dashboard/${studentId}/${classId}/progress`;
  return fetchWithCache(key, url);
};

export const getStudentAssignments = async (studentId, classId) => {
  const key = `assignments_${studentId}_${classId}`;
  const url = `${API_URL}/api/dashboard/${studentId}/${classId}/assignments`;
  return fetchWithCache(key, url);
};

export const getFilteredAssignments = async (studentId, classId, status) => {
  const key = `filteredAssignments_${studentId}_${classId}_${status}`;
  const url = `${API_URL}/api/dashboard/${studentId}/${classId}/assignments/filterByStatus`;
  return fetchWithCache(key, url, { status });
};

export const getSortedAssignments = async (studentId, classId, status = null) => {
  const key = `sortedAssignments_${studentId}_${classId}_${status || 'all'}`;
  const url = `${API_URL}/api/dashboard/${studentId}/${classId}/assignments/filterByDate`;
  return fetchWithCache(key, url, { status });
};

export const getStudentExamMarks = async (studentId, classId) => {
  const key = `examMarks_${studentId}_${classId}`;
  const url = `${API_URL}/api/dashboard/${studentId}/${classId}/exam-marks`;
  return fetchWithCache(key, url);
};

export const getMonthlyAttendanceRate = async (studentId, classId) => {
  const key = `monthlyAttendance_${studentId}_${classId}`;
  const url = `${API_URL}/api/dashboard/${studentId}/${classId}/mothlyAttendanceRate`; // fixed typo
  return fetchWithCache(key, url);
};

export const getWeeklyAttendanceRate = async (studentId, classId) => {
  const key = `weeklyAttendance_${studentId}_${classId}`;
  const url = `${API_URL}/api/dashboard/${studentId}/${classId}/weeklyAttendanceRate`;
  return fetchWithCache(key, url);
};

export const getAttendanceRate = async (studentId, classId) => {
  const key = `academicAttendance_${studentId}_${classId}`;
  const url = `${API_URL}/api/dashboard/${studentId}/${classId}/academicAttendanceRate`;
  return fetchWithCache(key, url);
};

export const getNonacademicAttendance = async (studentId, classId) => {
  const key = `nonacademicAttendance_${studentId}_${classId}`;
  const url = `${API_URL}/api/dashboard/${studentId}/${classId}/nonacademic-attendance`;
  return fetchWithCache(key, url);
};

export const getEngagementScore = async (studentId, classId) => {
  const key = `engagement_score_${studentId}_${classId}`;
  const url = `${API_URL}/api/dashboard/${studentId}/${classId}/engagement-score`;
  return fetchWithCache(key, url);
};

