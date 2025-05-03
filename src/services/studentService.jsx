import axios from 'axios';

export const getSubjectProgress = async (studentId, classId) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/progress`);
    return response.data;

};

export const getStudentAssignments = async (studentId, classId) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/assignments`);
    return response.data;
  };
  
  export const getFilteredAssignments = async (studentId, classId, status) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/assignments/filterByStatus`, {
      params: { status }
    });
    return response.data;
  };
  
  export const getSortedAssignments = async (studentId, classId, status = null) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/assignments/filterByDate`, {
      params: { status }
    });
    return response.data;
  };

  export const getStudentExamMarks = async (studentId, classId, examYear) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/exam-marks`);
    return response.data;
  };
  
  export const getMonthlyAttendanceRate = async (studentId, classId) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/mothlyAttendanceRate`);
    return response.data;
  };
  
  export const getWeeklyAttendanceRate = async (studentId, classId) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/weeklyAttendanceRate`);
    return response.data;
  };

  export const getAttendanceRate = async (studentId, classId) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/dashboard/${studentId}/${classId}/academicAttendanceRate`);
    return response.data;
  };