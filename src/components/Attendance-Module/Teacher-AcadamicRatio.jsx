import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import DoughnutChart from './DoughnutChart';
import CustomDropdown from './CustomDropdown';
import { ColorModeContext, tokens } from "../../theme";
const attendanceModuleUrl = import.meta.env.VITE_ATTENDANCE_MODULE_BACKEND_URL;

const AcadamicRatio = ({classId}) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [academicData, setAcademicData] = useState([
        { name: "Present", value: null, color: "#9C27B0" },
        { name: "Absent", value: null, color: "#F44336" },
    ]);
    const [acadamicApiData, setAcadamicApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [acadamicDataPeriod, setAcadamicDataPeriod] = useState('Yearly');

    const handleacadamicDataPeriodChange = (e) => {
        setAcadamicDataPeriod(e.target.value);
    };

    const acadamicDataPeriodOptions = [
        { label: 'Yearly', value: 'Yearly' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Daily', value: 'Daily' },
    ];

    // Function to fetch data from your API
    const fetchAttendanceData = async (summaryType) => {
        setLoading(true);
        setError(null);
        try {
            // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
            const response = await fetch(`${attendanceModuleUrl}/class/academic/ratio?class_id=${classId}&subject_id=academic&summary_type=${summaryType}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setAcadamicApiData(data.data); // Store the API data

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
        // Fetch initial data (e.g., for 'yearly')
        fetchAttendanceData(acadamicDataPeriod.toLowerCase());
    }, [acadamicDataPeriod]);

    // Update chart data when API data changes or component mounts
    useEffect(() => {
        if (acadamicApiData) {
            console.log("API Data:", acadamicApiData); // Log the API data for debugging
            const attendanceRatio = acadamicApiData.attendance_ratio * 100; // Convert to percentage
            setAcademicData([
                { name: "Present", value: attendanceRatio, color: "#9C27B0" },
                { name: "Absent", value: 100 - attendanceRatio, color: "#F44336" },
            ]);
        }
    }, [acadamicApiData]);

    const renderPercentageLabels = (data) => {
        return (
            <div
                style={{
                    position: "absolute", // <-- Important
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    fontSize: "12px",
                    zIndex: 1,
                    pointerEvents: "none", // <-- So it won't block mouse clicks
                    // backgroundColor: "white"
                }}
            >
                {data.map((entry, index) => (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            top: index === 0 ? "3%" : "60%",   // you can adjust
                            left: index === 0 ? "3%" : "80%",   // you can adjust
                            // transform: "translate(-50%, -50%)",
                            textAlign: "center",
                            color: entry.color,
                        }}
                    >
                        {entry.name}
                        <br />
                        {entry.value}%
                    </div>
                ))}
            </div>
        );
    };


    return (
        <Box sx={{
            height: 'auto',
            backgroundColor: colors.nav_bg_2,
            p: 2, // Optional: adds padding
        }}>
            <Paper
                sx={{
                    height: 321,
                    width: 230,
                    // maxWidth: 230,
                    // width: 'auto',
                    // height: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 2,
                    borderRadius: '10px',
                    position: 'relative',
                    boxShadow: 'none',
                }}
            >
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

                {/* Chart container */}
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <DoughnutChart data={academicData} />
                    {renderPercentageLabels(academicData)}
                </div>
            </Paper>
        </Box>
    );
};

export default AcadamicRatio;