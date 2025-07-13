import React from 'react'
import { Box, Paper, Typography, useTheme, CircularProgress } from '@mui/material'
import Calendar from './CustomCalender'
import CustomDropdown from './CustomDropdown'
import BarChartCompo from './BarChartCompo'
import BarChartPredicted from './BarChartPredicted'
import { useState, useEffect } from 'react'
import { ColorModeContext, tokens } from "../../theme";
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

const AcadamicSummary = ({classId}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [dailyData, setDailyData] = useState({});
    const [monthlyData, setMonthlyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);

    const [summeryType, setSummeryType] = useState('Predicted');
    const [month, setMonth] = useState('January');

    const summeryTypeOptions = [
        { label: 'Predicted', value: 'Predicted' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Weekly', value: 'Weekly' },
        { label: 'Daily', value: 'Daily' },
    ];

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

    const handlesummeryTypeChange = (e) => {
        setSummeryType(e.target.value);
    };

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    const fetchAttendanceData = async (summaryType, month) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${attendanceModuleUrl}/class/academic/summary?class_id=${classId}&subject_id=academic&summary_type=${summaryType}&month=${month}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const result = data?.data?.result || {};

            if (summaryType === 'daily') {
                const dailyData = Object.fromEntries(
                    Object.entries(result).map(([date, value]) => [date, (value) + "%"])
                );
                setDailyData(dailyData);
                setWeeklyData([]);
                setMonthlyData([]);
            } else if (summaryType === 'weekly') {
                const weeklyData = Object.entries(result).map(([x, value]) => ({ x: x.slice(0, 3), value: (value) }));
                setWeeklyData(weeklyData);
                setDailyData({});
                setMonthlyData([]);
            } else if (summaryType === 'monthly') {
                const monthlyData = Object.entries(result).map(([x, value]) => ({ x: x.slice(0, 3), value: (value) }));
                setMonthlyData(monthlyData);
                setDailyData({});
                setWeeklyData([]);
            }
        } catch (error) {
            console.error("Error fetching summary data:", error.message);
            setDailyData({});
            setWeeklyData([]);
            setMonthlyData([]);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceData(summeryType.toLowerCase(), month);
    }, [summeryType, month, classId]);

    const hasData = (data) => {
        if (Array.isArray(data)) return data.length > 0;
        return data && Object.keys(data).length > 0;
    };

    const renderContent = () => {
        if (summeryType === 'Predicted') {
            return <BarChartPredicted classId={classId} subjectId="academic" />;
        } else if (summeryType === 'Monthly') {
            return hasData(monthlyData) ? (
                <BarChartCompo data={monthlyData} />
            ) : <NoDataMessage />;
        } else if (summeryType === 'Weekly') {
            return (
                <Box>
                    {hasData(weeklyData) ? (
                        <BarChartCompo data={weeklyData} />
                    ) : <NoDataMessage />}
                </Box>
            );
        } else if (summeryType === 'Daily') {
            return (
                <Box>
                    {hasData(dailyData) ? (
                        <Calendar attendanceData={dailyData} month={month} />
                    ) : <NoDataMessage />}
                </Box>
            );
        }
        return null;
    };

    return (
        <Box sx={{
            height: '100%',
            backgroundColor: colors.nav_bg_2,
            p: 2,
        }}>
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
                    Academic Summary
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

                <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'flex-start', width: '100%' }}>
                    {!loading && renderContent()}
                </Box>
            </Paper>
        </Box>
    )
}

export default AcadamicSummary
