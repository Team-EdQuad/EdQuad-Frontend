import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

import DocumentCard from '../../components/Attendance-Module/DocumentCard';
import CustomDropdown from '../../components/Attendance-Module/CustomDropdown';

const TeacherDocument = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // for dropdown
    const [attendanceType, setAttendanceType] = useState('academic');
    const [subjectType, setSubjectType] = useState('SUB001');
    const [classId, setClassId] = useState('all');

    const subjectParam = attendanceType === 'academic' ? 'academic' : subjectType;

    const handleClassIdChange = (e) => {
        setClassId(e.target.value);
    };
    const handleAttendanceTypeChange = (e) => {
        setAttendanceType(e.target.value);
    };
    const handleSubjectTypeChange = (e) => {
        setSubjectType(e.target.value);
    };

    const classIdOptions = [
        { label: 'All', value: 'all'},
        { label: 'CLS001', value: 'CLS001' },
        { label: 'CLS002', value: 'CLS002' },
        { label: 'CLS003', value: 'CLS003' },
        { label: 'CLS013', value: 'CLS013' },
    ];
    const attendanceTypeOptions = [
        { label: 'Academic', value: 'academic' },
        { label: 'Non-Academic', value: 'nonAcademic' },
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
                `http://127.0.0.1:8000/attendance/view-document?class_id=${classId}&subject_id=${subjectParam}&student_id=all`
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

    useEffect(() => {
        fetchDocuments();
    }, [subjectParam, classId]);

    return (
        <Box
            sx={{
                height: '100%',
                minHeight: '100%',
                backgroundColor: '#EFF3FF',
                p: 4,
            }}
        >
            <Typography variant="h3" sx={{ mt: 2, ml: 0, mb: 4, color: '#333', fontWeight: 'bold', textAlign: 'left' }}>
                Uploaded Documents
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', mb: 4, width: '100%', gap: 2 }}>
                <CustomDropdown
                    value={classId}
                    onChange={handleClassIdChange}
                    menuItems={classIdOptions}
                />
                <CustomDropdown
                    value={attendanceType}
                    onChange={handleAttendanceTypeChange}
                    menuItems={attendanceTypeOptions}
                />
                {attendanceType !== 'academic' &&
                    <CustomDropdown
                        value={subjectType}
                        onChange={handleSubjectTypeChange}
                        menuItems={subjectTypeOptions}
                    />
                }
            </Box>

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

export default TeacherDocument; 