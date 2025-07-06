import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

import DocumentCard from '../../components/Attendance-Module/DocumentCard';
import FileUploadForm from '../../components/Attendance-Module/FileUploadForm';
import CustomDropdown from '../../components/Attendance-Module/CustomDropdown';
import { StoreContext } from '../../context/StoreContext';
const attendanceModuleUrl = import.meta.env.VITE_ATTENDANCE_MODULE_BACKEND_URL;


const StudentDocument = () => {

  const { id:studentId, classId } = useContext(StoreContext);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // for dropdown
  const [attendanceType, setAttendanceType] = useState('academic');
  const [sportsId, setSportsId] = useState('');
  const [clubsId, setClubsId] = useState('');
  const [sportsOptions, setSportsOptions] = useState([]);
  const [clubsOptions, setClubsOptions] = useState([]);

  const subjectParam = attendanceType === 'academic' ? 'academic' : 
                      attendanceType === 'sport' ? sportsId : 
                      attendanceType === 'club' ? clubsId : 'academic';

  const handleAttendanceTypeChange = (e) => {
    setAttendanceType(e.target.value);
  };
  const handleSportsIdChange = (e) => {
    setSportsId(e.target.value);
  };
  const handleClubsIdChange = (e) => {
    setClubsId(e.target.value);
  };

  const attendanceTypeOptions = [
    { label: 'Academic', value: 'academic' },
    { label: 'Sports', value: 'sport' },
    { label: 'Clubs', value: 'club' }
  ];

  // Fetch non-academic subjects
  const fetchNonAcademicSubjects = async () => {
    try {
      const response = await axios.get(`${attendanceModuleUrl}/non-acadamic/subjects/${studentId}`);
      const subjects = response.data.subject_ids;
      
      // Filter and set sports options
      const sports = subjects.filter(id => id.startsWith('SPT')).map(id => ({
        label: id,
        value: id
      }));
      setSportsOptions(sports);
      
      // Filter and set clubs options
      const clubs = subjects.filter(id => id.startsWith('CLB')).map(id => ({
        label: id,
        value: id
      }));
      setClubsOptions(clubs);

      // Set initial values if not set
      if (!sportsId && sports.length > 0) setSportsId(sports[0].value);
      if (!clubsId && clubs.length > 0) setClubsId(clubs[0].value);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `${attendanceModuleUrl}/documents?class_id=${classId}&subject_id=${subjectParam}&student_id=${studentId}`
      );

      setDocuments(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (doc) => {
    window.open(doc.file_url, '_blank');
  };

  const handleDelete = async (doc) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await axios.delete(`${attendanceModuleUrl}/delete/document/${doc._id}`);
      setDocuments((prevDocs) => prevDocs.filter((d) => d._id !== doc._id));
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document.');
    }
  };

  // Refresh documents after successful file upload
  const handleUploadSuccess = () => {
    fetchDocuments();
  };

  useEffect(() => {
    fetchNonAcademicSubjects();
  }, [studentId]);

  useEffect(() => {
    fetchDocuments();
  }, [subjectParam]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#EFF3FF',
        p: 4,
      }}
    >
      <Typography variant="h3" sx={{ mt: 2, ml: 0, mb: 3, color: '#333', fontWeight: 'bold', textAlign: 'left' }}>
        Document Upload
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', mb: 0, width: '100%', gap: 2 }}>
        <CustomDropdown
          value={attendanceType}
          onChange={handleAttendanceTypeChange}
          menuItems={attendanceTypeOptions}
        />
        {attendanceType === 'sport' && (
          <CustomDropdown
            value={sportsId}
            onChange={handleSportsIdChange}
            menuItems={sportsOptions}
          />
        )}
        {attendanceType === 'club' && (
          <CustomDropdown
            value={clubsId}
            onChange={handleClubsIdChange}
            menuItems={clubsOptions}
          />
        )}
      </Box>

      <FileUploadForm
        student_id={studentId}
        class_id={classId}
        subject_id={subjectParam}
        onUploadSuccess={handleUploadSuccess}
      />

      <Typography variant="h3" sx={{ color: '#333', fontWeight: 'SemiBold', mb: 2 }}>
        Previous Uploaded Documents
      </Typography>

      {loading && <div>Loading...</div>}
      {documents.slice().reverse().map((doc, index) => (
        <DocumentCard
          key={doc._id ?? index}
          doc={doc}
          index={index}
          onView={handleView}
          onDelete={handleDelete}
        />
      ))}
    </Box>
  );
};

export default StudentDocument;
