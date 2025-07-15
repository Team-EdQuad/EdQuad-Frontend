import React, { useState, useContext, useRef, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { format } from 'date-fns';
import axios from 'axios';

import { StoreContext } from '../../context/StoreContext';
import { useElementSize } from '../../hooks/useElementSize';

import CustomDropdown from '../../components/Attendance-Module/CustomDropdown';
import DateSelector from '../../components/Attendance-Module/DateSelector';
import AttendanceTable from '../../components/Attendance-Module/AttendanceTable';
const attendanceModuleUrl = import.meta.env.VITE_ATTENDANCE_MODULE_BACKEND_URL;


const TeacherAttendanceEntry = () => {
    const [panelRef, panelSize] = useElementSize();

    console.log("This is from table: " + panelSize.width);
    const isExtraSmallPaper = panelSize.width < 430;
    const isSmallPaper = panelSize.width < 650;
    const isMediumPaper = panelSize.width < 840;
    const isLargePaper = panelSize.width >= 840;

    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [classId, setClassId] = useState('CLS001');
    const [subjectType, setsubjectType] = useState('academic');
    const [sportsId, setSportsId] = useState('');
    const [clubsId, setClubsId] = useState('');
    const [sportsOptions, setSportsOptions] = useState([]);
    const [clubsOptions, setClubsOptions] = useState([]);

    // Define screen size breakpoints
    const isExtraSmallScreen = useMediaQuery('(max-width:600px)');
    const isSmallScreen = useMediaQuery('(max-width:768px)');
    const isMediumScreen = useMediaQuery('(max-width:900px)');
    const isLargeScreen = useMediaQuery('(max-width:1200px)');
    const isExtraLargeScreen = useMediaQuery('(max-width:1536px)');

    // Fetch sports and clubs data
    const fetchNonAcademicSubjects = async () => {
        try {
            const response = await axios.get(`${attendanceModuleUrl}/non-acadamic/subjects`);
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

    useEffect(() => {
        fetchNonAcademicSubjects();
    }, []);

    const handleClassIdChange = (e) => {
        setClassId(e.target.value);
    };
    const handleSubjectTypeChange = (e) => {
        setsubjectType(e.target.value);
    };
    const handleSportsIdChange = (e) => {
        setSportsId(e.target.value);
    };
    const handleClubsIdChange = (e) => {
        setClubsId(e.target.value);
    };

    // const classIdOptions = [
    //     { label: 'CLS001', value: 'CLS001' },
    //     { label: 'CLS002', value: 'CLS002' },
    //     { label: 'CLS003', value: 'CLS003' },
    //     { label: 'CLS013', value: 'CLS013' },
    // ];

    const classIdOptions = [
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

    const subjectTypeOptions = [
        { label: 'Academic', value: 'academic' },
        { label: 'Sports', value: 'sport' },
        { label: 'Clubs', value: 'club' }
    ];

    return (
        <Box ref={panelRef} sx={{
            height: '100%',
            minHeight: '100%',
            backgroundColor: '#EFF3FF',
            p: isExtraSmallPaper ? 1 : 4,
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                <Typography variant="h4" sx={{ mt: 2, ml: 0, mb: 3, color: '#333', fontWeight: 'semibold', textAlign: isExtraSmallPaper ? 'center' : 'left' }}>
                    Student Attendance Entry
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: isExtraSmallPaper ? 'center' : 'flex-start', width: '100%' }}>
                    <Grid
                        container
                        spacing={2}
                        sx={{ width: '100%', maxWidth: 900, mb: 2, justifyContent: isExtraSmallPaper ? 'center' : 'flex-start' }}
                    // justifyContent="flex-start"
                    >
                        <Grid item xs={12} sm={6} md={3}>
                            <CustomDropdown
                                value={classId}
                                onChange={handleClassIdChange}
                                menuItems={classIdOptions}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <CustomDropdown
                                value={subjectType}
                                onChange={handleSubjectTypeChange}
                                menuItems={subjectTypeOptions}
                            />
                        </Grid>

                        {subjectType == 'sport' && (
                            <Grid item xs={12} sm={6} md={3}>
                                <CustomDropdown
                                    value={sportsId}
                                    onChange={handleSportsIdChange}
                                    menuItems={sportsOptions}
                                />
                            </Grid>
                        )}

                        {subjectType == 'club' && (
                            <Grid item xs={12} sm={6} md={3}>
                                <CustomDropdown
                                    value={clubsId}
                                    onChange={handleClubsIdChange}
                                    menuItems={clubsOptions}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6} md={3}>
                            <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ maxWidth: '1000px', width: 'auto' }}>
                    <AttendanceTable
                        classId={classId}
                        subjectType={subjectType}
                        subjectId={subjectType == 'sport' ? sportsId : subjectType == 'club' ? clubsId : 'academic'}
                        selectedDate={selectedDate}
                        mode='edit'
                        panelSize={panelSize.width}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default TeacherAttendanceEntry;
{/* <Box sx={{ overflowX: 'auto' }}></Box> */ }