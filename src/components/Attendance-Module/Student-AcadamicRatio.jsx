import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import DoughnutChart from './DoughnutChart';
import CustomDropdown from './CustomDropdown';

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
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        zIndex: 1,
    }}>
        <Typography variant="h6" color="text.secondary">👀</Typography>
        <Typography variant="body1" color="text.secondary">Data not found</Typography>
    </Box>
);

const AcadamicRatio = ({ studentId }) => {
    const [academicData, setAcademicData] = useState(null);
    const [acadamicApiData, setAcadamicApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [acadamicDataPeriod, setAcadamicDataPeriod] = useState('Yearly');

    const handleacadamicDataPeriodChange = (e) => {
        setAcadamicDataPeriod(e.target.value);
    };

    const acadamicDataPeriodOptions = [
        { label: 'Year-to-Date', value: 'Yearly' },
        { label: 'Month-to-Date', value: 'Monthly' },
        { label: 'Today', value: 'Daily' },
    ];

    const fetchAttendanceData = async (summaryType) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${attendanceModuleUrl}/student/academic/ratio?student_id=${studentId}&subject_id=academic&summary_type=${summaryType}`
            );

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            if (data?.data?.attendance_ratio != null) {
                setAcadamicApiData(data.data);
            } else {
                setAcadamicApiData(null);
            }
        } catch (error) {
            console.error("Error:", error.message);
            setAcadamicApiData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceData(acadamicDataPeriod.toLowerCase());
    }, [acadamicDataPeriod]);

    useEffect(() => {
        if (acadamicApiData) {
            const attendanceRatio = acadamicApiData.attendance_ratio;
            setAcademicData([
                { name: "Present", value: attendanceRatio, color: "#9C27B0" },
                { name: "Absent", value: 100 - attendanceRatio, color: "#F44336" },
            ]);
        } else {
            setAcademicData(null);
        }
    }, [acadamicApiData]);

    const renderPercentageLabels = (data) => (
        <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            fontSize: "12px",
            zIndex: 1,
            pointerEvents: "none",
        }}>
            {data.map((entry, index) => (
                <div
                    key={index}
                    style={{
                        position: "absolute",
                        top: index === 0 ? "3%" : "60%",
                        left: index === 0 ? "3%" : "80%",
                        textAlign: "center",
                        color: entry.color,
                    }}
                >
                    {entry.name}
                    <br />
                    {parseFloat(entry.value).toFixed(2)}%
                </div>
            ))}
        </div>
    );

    return (
        <Box sx={{ height: '100%', backgroundColor: '#EFF3FF', p: 2 }}>
            <Paper
                sx={{
                    height: 321,
                    width: 230,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 2,
                    borderRadius: '10px',
                    position: 'relative',
                    boxShadow: 'none',
                }}
            >
                {loading && <LoadingOverlay />}
                <Typography variant="h5" sx={{ mb: '20px' }}>
                    Academic
                </Typography>

                <div style={{ marginBottom: '20px' }}>
                    <CustomDropdown
                        value={acadamicDataPeriod}
                        onChange={handleacadamicDataPeriodChange}
                        menuItems={acadamicDataPeriodOptions}
                    />
                </div>

                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {!loading && academicData ? (
                        <>
                            <DoughnutChart data={academicData} />
                            {renderPercentageLabels(academicData)}
                        </>
                    ) : !loading && <NoDataMessage />}
                </div>
            </Paper>
        </Box>
    );
};

export default AcadamicRatio;
