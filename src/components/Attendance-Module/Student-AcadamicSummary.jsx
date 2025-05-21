import React, { use } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import Calendar from './CustomCalender'
import CustomDropdown from './CustomDropdown'
import BarChartCompo from './BarChartCompo'
import { useState, useEffect } from 'react'
const attendanceModuleUrl = import.meta.env.VITE_ATTENDANCE_MODULE_BACKEND_URL;

const AcadamicSummary = ({studentId}) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [dailyData, setDailyData] = useState({});
    const [monthlyData, setMonthlyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);

    const [summaryType, setSummaryType] = useState('Monthly');

    const handleSummaryTypeChange = (e) => {
        setSummaryType(e.target.value);
    };

    const summaryTypeOptions = [
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Weekly', value: 'Weekly' },
        { label: 'Daily', value: 'Daily' },
    ];

    const [month, setMonth] = useState('April');

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
    const fetchAttendanceData = async (summaryType, month) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${attendanceModuleUrl}/student/academic/summary?student_id=${studentId}&subject_id=academic&summary_type=${summaryType}&month=${month}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (summaryType === 'daily') {
                const dailyData = Object.fromEntries(
                    Object.entries(data.data.result).map(([date, value]) => [date, value.charAt(0).toUpperCase() + value.slice(1)])
                );
                setDailyData(dailyData);

            } else if (summaryType === 'weekly') {
                const weeklyData = Object.entries(data.data.result).map(([x, value]) => ({ x: x.slice(0, 3), value: (value * 100) }));
                setWeeklyData(weeklyData);
            } else if (summaryType === 'monthly') {
                const monthlyData = Object.entries(data.data.result).map(([x, value]) => ({ x: x.slice(0, 3), value: (value * 100) }));
                setMonthlyData(monthlyData);
                console.log('Processed Monthly Data:', monthlyData);
            }

        } catch (error) {
            if (error.response) {
                console.error(`Error ${error.response.status}:`, error.response.data);
                if (error.response.status === 404) {
                    console.error("Data not found (404)");
                    setAcadamicApiData(null);
                }
            } else {
                console.error("Error:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch initial data with proper case
        fetchAttendanceData(summaryType.toLowerCase(), month);
    }, [summaryType, month]);

    return (
        <Box sx={{
            height: '100%',
            backgroundColor: '#EFF3FF',
            p: 2,
        }}>
            <Paper
                sx={{
                    height: '550px',
                    width: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingX: '11px',
                    borderRadius: '10px',
                    position: 'relative',
                    boxShadow: 'none'
                }}
            >
                <Box sx={{ display: 'fles', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '25px 25px 10px 25px' }}>
                    <Typography variant="h5" color="#000">Academic</Typography>
                    <CustomDropdown
                        value={summaryType}
                        onChange={handleSummaryTypeChange}
                        menuItems={summaryTypeOptions}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'flex-start', width: '100%' }}>
                    {summaryType === 'Monthly' ? (
                        <BarChartCompo data={monthlyData} />
                    ) : summaryType === 'Weekly' ? (
                        <Box>
                            <Box display="flex" justifyContent="flex-end" mb={2} mx={"25px"}>
                                <CustomDropdown
                                    value={month}
                                    onChange={handleMonthChange}
                                    menuItems={monthOptions}
                                />
                            </Box>
                            <BarChartCompo data={weeklyData} />
                        </Box>
                    ) : summaryType === 'Daily' ? (
                        <Box>
                            <Box display="flex" justifyContent="flex-end" mb={2} mx={"25px"}>
                                <CustomDropdown
                                    value={month}
                                    onChange={handleMonthChange}
                                    menuItems={monthOptions}
                                />
                            </Box>
                            <Calendar attendanceData={dailyData} month={month} />
                        </Box>
                    ) : null}
                </Box>
            </Paper>
        </Box>
    )
}

export default AcadamicSummary
