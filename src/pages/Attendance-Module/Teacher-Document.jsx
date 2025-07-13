
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

import DocumentCard from '../../components/Attendance-Module/DocumentCard';
import CustomDropdown from '../../components/Attendance-Module/CustomDropdown';
const attendanceModuleUrl = import.meta.env.VITE_ATTENDANCE_MODULE_BACKEND_URL;

// Subject ID to Name mapping
const SUBJECT_NAMES = {
    'SPT001': 'Cricket',
    'SPT002': 'Football',
    'SPT003': 'Basketball',
    'SPT004': 'Tennis',
    'SPT005': 'Swimming',
    'SPT006': 'Badminton',
    'CLB001': 'Netball',
    'CLB002': 'Dance',
    'CLB003': 'Drama',
    'CLB004': 'Singing',
    'CLB005': 'Scout',
    'CLB006': 'Science Club',
    // Add more mappings as needed
};

const TeacherDocument = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // for dropdown
    const [attendanceType, setAttendanceType] = useState('academic');
    const [sportsId, setSportsId] = useState('');
    const [clubsId, setClubsId] = useState('');
    const [classId, setClassId] = useState('all');
    const [sportsOptions, setSportsOptions] = useState([]);
    const [clubsOptions, setClubsOptions] = useState([]);

    const subjectParam = attendanceType === 'academic' ? 'academic' : 
                        attendanceType === 'sport' ? sportsId : 
                        attendanceType === 'club' ? clubsId : 'academic';

    const handleClassIdChange = (e) => {
        setClassId(e.target.value);
    };
    const handleAttendanceTypeChange = (e) => {
        setAttendanceType(e.target.value);
    };
    const handleSportsIdChange = (e) => {
        setSportsId(e.target.value);
    };
    const handleClubsIdChange = (e) => {
        setClubsId(e.target.value);
    };

    const classIdOptions = [
        { label: 'All', value: 'all'},
        { label: 'Grade 6A', value: 'CLS001' },
        { label: 'Grade 6B', value: 'CLS002' },
        { label: 'Grade 7A', value: 'CLS003' },
        { label: 'Grade 7B', value: 'CLS004' },
        { label: 'Grade 8A', value: 'CLS005' },
        { label: 'Grade 8B', value: 'CLS006' },
        { label: 'Grade 9A', value: 'CLS007' },
        { label: 'Grade 9B', value: 'CLS008' },
        { label: 'Grade 10A', value: 'CLS009' },
        { label: 'Grade 10B', value: 'CLS010' },
        { label: 'Grade 11A', value: 'CLS011' },
        { label: 'Grade 11B', value: 'CLS012' }

    ];
    const attendanceTypeOptions = [
        { label: 'Academic', value: 'academic' },
        { label: 'Sports', value: 'sport' },
        { label: 'Clubs', value: 'club' }
    ];

    // Fetch sports and clubs data
    const fetchNonAcademicSubjects = async () => {
        try {
            const response = await axios.get(`${attendanceModuleUrl}/non-acadamic/subjects`);
            const subjects = response.data.subject_ids;
            
            // Filter and set sports options
            const sports = subjects.filter(id => id.startsWith('SPT')).map(id => ({
                label: SUBJECT_NAMES[id] || id, // Use subject name if available, otherwise use ID
                value: id
            }));
            setSportsOptions(sports);
            
            // Filter and set clubs options
            const clubs = subjects.filter(id => id.startsWith('CLB')).map(id => ({
                label: SUBJECT_NAMES[id] || id, // Use subject name if available, otherwise use ID
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
                `${attendanceModuleUrl}/documents?class_id=${classId}&subject_id=${subjectParam}&student_id=all`
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
            await axios.delete(`${attendanceModuleUrl}/delete-document/${doc._id}`);
            setDocuments((prevDocs) => prevDocs.filter((d) => d._id !== doc._id));
        } catch (error) {
            console.error('Failed to delete document:', error);
            alert('Failed to delete document.');
        }
    };

    useEffect(() => {
        fetchNonAcademicSubjects();
    }, []);

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
            <Typography variant="h4" sx={{ mt: 2, ml: 0, mb: 4, color: '#333', fontWeight: 'semibold', textAlign: 'left' }}>
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