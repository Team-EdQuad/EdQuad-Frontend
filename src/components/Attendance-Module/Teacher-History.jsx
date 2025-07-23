import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    useTheme,
    Grid
} from '@mui/material';
import CustomDropdown from './CustomDropdown';
import DateSelector from './DateSelector';
import { format } from 'date-fns';
import AttendanceTable from './AttendanceTable';
import { ColorModeContext, tokens } from "../../theme";
import axios from 'axios';

const attendanceModuleUrl = import.meta.env.VITE_ATTENDANCE_MODULE_BACKEND_URL;

const History = ({classId}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    // const [selectedDate, setSelectedDate] = useState('2025-01-06');
    const [attendanceType, setAttendanceType] = useState('academic');
    const [sportsId, setSportsId] = useState('');
    const [clubsId, setClubsId] = useState('');
    const [sportsOptions, setSportsOptions] = useState([]);
    const [clubsOptions, setClubsOptions] = useState([]);

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
        { label: 'Clubs', value: 'club' },
    ];

    return (
        <Box sx={{
            height: '100%',
            backgroundColor: colors.nav_bg_2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflow: 'hidden'
        }}>
            <Paper sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
                borderRadius: '10px',
                boxShadow: 'none',
                overflow: 'hidden'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2
                }}>
                    <Typography variant="h5" color="#000">History</Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        width: { xs: '100%', sm: 'auto' }
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <CustomDropdown
                                    value={attendanceType}
                                    onChange={handleAttendanceTypeChange}
                                    menuItems={attendanceTypeOptions}
                                />
                            </Grid>

                            {attendanceType === 'sport' && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <CustomDropdown
                                        value={sportsId}
                                        onChange={handleSportsIdChange}
                                        menuItems={sportsOptions}
                                    />
                                </Grid>
                            )}

                            {attendanceType === 'club' && (
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
                </Box>
                
                <Box sx={{ width: '100%', overflow: 'auto' }}>
                    <AttendanceTable
                        classId={classId}
                        attendanceType={attendanceType}
                        subjectType={attendanceType}
                        subjectId={attendanceType === 'sport' ? sportsId : attendanceType === 'club' ? clubsId : 'academic'}
                        selectedDate={selectedDate}
                        mode='view'
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default History;