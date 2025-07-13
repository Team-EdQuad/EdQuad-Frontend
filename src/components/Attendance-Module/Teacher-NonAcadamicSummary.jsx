import React, { use } from 'react'
import { Box, Paper, Typography, useTheme, CircularProgress } from '@mui/material'
import Calendar from './CustomCalender'
import CustomDropdown from './CustomDropdown'
import BarChartCompo from './BarChartCompo'
import { useState, useEffect } from 'react'
import { ColorModeContext, tokens } from "../../theme";
import axios from 'axios';
import { getSubjectName } from './SubjectNameMapping';

const attendanceModuleUrl = import.meta.env.VITE_ATTENDANCE_MODULE_BACKEND_URL;

const LoadingOverlay = () => (
    <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1,
        borderRadius: 'inherit'
    }}>
        <CircularProgress />
    </Box>
);

const NoDataMessage = () => (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        py: 4,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    }}>
        <Typography variant="h6" color="text.secondary">👀</Typography>
        <Typography variant="body1" color="text.secondary">Data not found</Typography>
    </Box>
);

const NonAcadamicSummary = ({classId}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [dailyData, setDailyData] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState(null);

    const [subjectType, setSubjectType] = useState('');
    const [subjectTypeOptions, setSubjectTypeOptions] = useState([]);

    const handleSubjectTypeChange = (e) => {
        setSubjectType(e.target.value);
    };

    // Function to fetch non-academic subjects
    const fetchNonAcademicSubjects = async () => {
        try {
            const response = await axios.get(`${attendanceModuleUrl}/non-acadamic/subjects`);
            const subjects = response.data.subject_ids;
            
            // Transform the subject IDs into the format needed for the dropdown
            const options = subjects.map(id => ({
                label: getSubjectName(id),
                value: id
            }));
            
            setSubjectTypeOptions(options);
            
            // Set initial value if not set
            if (!subjectType && options.length > 0) {
                setSubjectType(options[0].value);
            }
        } catch (error) {
            console.error('Failed to fetch subjects:', error);
            setError('Failed to fetch subjects');
        }
    };

    const [summeryType, setSummeryType] = useState('Monthly');

    const handlesummeryTypeChange = (e) => {
        setSummeryType(e.target.value);
    };

    const summeryTypeOptions = [
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Weekly', value: 'Weekly' },
        { label: 'Daily', value: 'Daily' },
    ];

    const [month, setMonth] = useState('January');

    const monthOptions = [
        { label: 'January', value: 'January' },
        { label: 'February', value: 'February' },
        { label: 'March', value: 'March' },
        { label: 'April', value: 'April' },
        { label: 'May', value: 'May' },
        { label: 'June', value: 'June' },
        { label: 'July', value: 'July' },
        { label: 'August', value: 'August' },
        { label: 'September', value: 'September' },
        { label: 'October', value: 'October' },
        { label: 'November', value: 'November' },
        { label: 'December', value: 'December' },
    ];

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    // Function to fetch data from your API
    const fetchAttendanceData = async (summaryType, month, subjectType) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${attendanceModuleUrl}/class/nonacademic/summary?class_id=${classId}&subject_id=${subjectType}&summary_type=${summaryType}&month=${month}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const result = data.data.result;

            if (summaryType === 'daily') {
                const daily = Object.fromEntries(
                    Object.entries(result).map(([date, value]) => [date, (value) + "%"])
                );
                setDailyData(Object.keys(daily).length ? daily : null);
                setWeeklyData(null);
                setMonthlyData([]);
            } else if (summaryType === 'weekly') {
                const weekly = Object.entries(result).map(([x, value]) => ({ x: x.slice(0, 3), value: (value) }));
                setWeeklyData(weekly.length ? weekly : null);
                setDailyData(null);
                setMonthlyData([]);
            } else if (summaryType === 'monthly') {
                const monthly = Object.entries(result).map(([x, value]) => ({ x: x.slice(0, 3), value: (value) }));
                setMonthlyData(monthly.length ? monthly : []);
                setWeeklyData(null);
                setDailyData(null);
            }
        } catch (error) {
            console.error("Error:", error.message);
            setDailyData(null);
            setWeeklyData(null);
            setMonthlyData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch initial data
        fetchAttendanceData(summeryType.toLowerCase(), month, subjectType);
    }, [summeryType, month, subjectType, classId]);

    // Add useEffect for fetching subjects
    useEffect(() => {
        fetchNonAcademicSubjects();
    }, []);

    const hasData = (data) => {
        if (!data) return false;
        if (Array.isArray(data)) return data.length > 0;
        return Object.keys(data).length > 0;
    };

    const renderContent = () => {
        if (!subjectType) return <NoDataMessage />;

        if (summeryType === 'Monthly') {
            return hasData(monthlyData) ? <BarChartCompo data={monthlyData} /> : <NoDataMessage />;
        } else if (summeryType === 'Weekly') {
            return hasData(weeklyData) ? <BarChartCompo data={weeklyData} /> : <NoDataMessage />;
        } else if (summeryType === 'Daily') {
            return hasData(dailyData) ? <Calendar attendanceData={dailyData} month={month} /> : <NoDataMessage />;
        }
        return null;
    };

    return (
        <Box sx={{ height: '100%', backgroundColor: '#EFF3FF', p: 2 }}>
            <Paper sx={{
                minHeight: 400,
                height: 'auto',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 2,
                borderRadius: '10px',
                position: 'relative',
                boxShadow: 'none'
            }}>
                {loading && <LoadingOverlay />}
                <Typography variant="h5" sx={{ mb: '20px' }}>
                    Non-Academic Summary
                </Typography>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    mb: 2,
                    gap: 1
                }}>
                    <CustomDropdown
                        value={subjectType}
                        onChange={handleSubjectTypeChange}
                        menuItems={subjectTypeOptions}
                    />
                    <CustomDropdown
                        value={summeryType}
                        onChange={handlesummeryTypeChange}
                        menuItems={summeryTypeOptions}
                    />
                    {(summeryType === 'Weekly' || summeryType === 'Daily') && (
                        <CustomDropdown
                            value={month}
                            onChange={handleMonthChange}
                            menuItems={monthOptions}
                        />
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'flex-start', width: '100%', mt: 2 }}>
                    {!loading && renderContent()}
                </Box>
            </Paper>
        </Box>
    );
};

export default NonAcadamicSummary;
