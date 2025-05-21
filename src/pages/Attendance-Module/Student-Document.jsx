import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

import DocumentCard from '../../components/Attendance-Module/DocumentCard';
import FileUploadForm from '../../components/Attendance-Module/FileUploadForm';
import CustomDropdown from '../../components/Attendance-Module/CustomDropdown';

const StudentDocument = ({studentId, classId}) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // for dropdown
  const [attendanceType, setAttendanceType] = useState('academic');
  const [subjectType, setSubjectType] = useState('SUB001');

  const subjectParam = attendanceType === 'academic' ? 'academic' : subjectType;

  const handleAttendanceTypeChange = (e) => {
    setAttendanceType(e.target.value);
  };
  const handleSubjectTypeChange = (e) => {
    setSubjectType(e.target.value);
  };

  const attendanceTypeOptions = [
    { label: 'Acadamic', value: 'academic' },
    { label: 'Non-Acadamic', value: 'nonAcadamic' },
  ];
  const subjectTypeOptions = [
    { label: 'Cricket', value: 'SUB001' },
    { label: 'Basketball', value: 'SUB002' },
    { label: 'Science Club', value: 'SUB003' },
    { label: 'Maths Club', value: 'SUB004' },
  ];


  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/attendance/view-document?class_id=${classId}&subject_id=${subjectParam}&student_id=${studentId}`
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
      await axios.delete(`http://127.0.0.1:8000/attendance/delete-document/${doc._id}`);
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
        {attendanceType != 'academic' &&
          <CustomDropdown
            value={subjectType}
            onChange={handleSubjectTypeChange}
            menuItems={subjectTypeOptions}
          />
        }
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
