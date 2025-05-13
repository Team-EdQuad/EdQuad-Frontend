import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import DoughnutChart from './DoughnutChart';
import CustomDropdown from './CustomDropdown';

const NonAcadamicRatio = ({ studentId }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const [subjectList, setSubjectList] = useState([]);

    const fetchSubjects = async (studentId) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/attendance/subjects/${studentId}`
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched subjects:", data.subject_ids);
            return data.subject_ids;
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
            return [];
        }
    };

    useEffect(() => {
        fetchSubjects(studentId).then((subjects) => {
            setSubjectList(subjects);
        });
        console.log("Subject List:", subjectList);
    }, [studentId]);



    // for Cricket
    const [nonAcademicDataCricket, setNonAcademicDataCricket] = useState([
        { name: "Present", value: null, color: "#9C27B0" },
        { name: "Absent", value: null, color: "#F44336" },
    ]);
    const [nonAcadamicApiDataCricket, setNonAcadamicApiDataCricket] = useState(null);
    const [nonAcadamicDataCricketPeriod, setNonAcadamicDataCricketPeriod] = useState('Yearly');

    const handlenonAcadamicDataCricketPeriodChange = (e) => {
        setNonAcadamicDataCricketPeriod(e.target.value);
    };

    const nonAcadamicDataCricketPeriodOptions = [
        { label: 'Yearly', value: 'Yearly' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Daily', value: 'Daily' },
    ];

    // for Basketball
    const [nonAcademicDataBasketball, setNonAcademicDataBasketball] = useState([
        { name: "Present", value: null, color: "#9C27B0" },
        { name: "Absent", value: null, color: "#F44336" },
    ]);
    const [nonAcadamicApiDataBasketball, setNonAcadamicApiDataBasketball] = useState(null);
    const [nonAcadamicDataBasketballPeriod, setNonAcadamicDataBasketballPeriod] = useState('Yearly');

    const handlenonAcadamicDataBasketballPeriodChange = (e) => {
        setNonAcadamicDataBasketballPeriod(e.target.value);
    };

    const nonAcadamicDataBasketballPeriodOptions = [
        { label: 'Yearly', value: 'Yearly' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Daily', value: 'Daily' },
    ];

    // for Science Club
    const [nonAcademicDataScienceClub, setNonAcademicDataScienceClub] = useState([
        { name: "Present", value: null, color: "#9C27B0" },
        { name: "Absent", value: null, color: "#F44336" },
    ]);
    const [nonAcadamicApiDataScienceClub, setNonAcadamicApiDataScienceClub] = useState(null);
    const [nonAcadamicDataScienceClubPeriod, setNonAcadamicDataScienceClubPeriod] = useState('Yearly');

    const handlenonAcadamicDataScienceClubPeriodChange = (e) => {
        setNonAcadamicDataScienceClubPeriod(e.target.value);
    };

    const nonAcadamicDataScienceClubPeriodOptions = [
        { label: 'Yearly', value: 'Yearly' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Daily', value: 'Daily' },
    ];

    // for Maths Club
    const [nonAcademicDataMaths, setNonAcademicDataMaths] = useState([
        { name: "Present", value: null, color: "#9C27B0" },
        { name: "Absent", value: null, color: "#F44336" },
    ]);
    const [nonAcadamicApiDataMaths, setNonAcadamicApiDataMaths] = useState(null);
    const [nonAcadamicDataMathsPeriod, setNonAcadamicDataMathsPeriod] = useState('Yearly');

    const handlenonAcadamicDataMathsPeriodChange = (e) => {
        setNonAcadamicDataMathsPeriod(e.target.value);
    };

    const nonAcadamicDataMathsPeriodOptions = [
        { label: 'Yearly', value: 'Yearly' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Daily', value: 'Daily' },
    ];

    // Function to fetch data from your API
    const fetchAttendanceData = async (subject, summaryType) => {
        setLoading(true);
        setError(null);
        try {
            
            // const response = await fetch(`http://127.0.0.1:8000/attendance/class/nonacademic/ratio?class_id=${classId}&subject_id=${subject}&summary_type=${summaryType}`);
            const response = await fetch(`http://127.0.0.1:8000/attendance/student/nonacademic/ratio?student_id=${studentId}&subject_id=${subject}&summary_type=${summaryType}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (subject === 'SUB001') {
                setNonAcadamicApiDataCricket(data.data); // Store the API data for cricket
            } else if (subject === 'SUB002') {
                setNonAcadamicApiDataBasketball(data.data); // Store the API data for basketball
            } else if (subject === 'SUB003') {
                setNonAcadamicApiDataScienceClub(data.data); // Store the API data for science club
            } else if (subject === 'SUB004') {
                setNonAcadamicApiDataMaths(data.data); // Store the API data for maths
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch initial data (e.g., for 'yearly')
        fetchAttendanceData('SUB001', nonAcadamicDataCricketPeriod.toLowerCase());
        fetchAttendanceData('SUB002', nonAcadamicDataBasketballPeriod.toLowerCase());
        fetchAttendanceData('SUB003', nonAcadamicDataScienceClubPeriod.toLowerCase());
        fetchAttendanceData('SUB004', nonAcadamicDataMathsPeriod.toLowerCase());
    }, [nonAcadamicDataCricketPeriod, nonAcadamicDataBasketballPeriod, nonAcadamicDataScienceClubPeriod, nonAcadamicDataMathsPeriod]);

    // Update chart data when API data changes or component mounts
    useEffect(() => {
        if (nonAcadamicApiDataCricket) {
            const attendanceRatio = nonAcadamicApiDataCricket.attendance_ratio * 100; // Convert to percentage
            setNonAcademicDataCricket([
                { name: "Present", value: attendanceRatio, color: "#9C27B0" },
                { name: "Absent", value: 100 - attendanceRatio, color: "#F44336" },
            ]);
        }
        if (nonAcadamicApiDataBasketball) {
            const attendanceRatio = nonAcadamicApiDataBasketball.attendance_ratio * 100; // Convert to percentage
            setNonAcademicDataBasketball([
                { name: "Present", value: attendanceRatio, color: "#9C27B0" },
                { name: "Absent", value: 100 - attendanceRatio, color: "#F44336" },
            ]);
        }
        if (nonAcadamicApiDataScienceClub) {
            const attendanceRatio = nonAcadamicApiDataScienceClub.attendance_ratio * 100; // Convert to percentage
            setNonAcademicDataScienceClub([
                { name: "Present", value: attendanceRatio, color: "#9C27B0" },
                { name: "Absent", value: 100 - attendanceRatio, color: "#F44336" },
            ]);
        }
        if (nonAcadamicApiDataMaths) {
            const attendanceRatio = nonAcadamicApiDataMaths.attendance_ratio * 100; // Convert to percentage
            setNonAcademicDataMaths([
                { name: "Present", value: attendanceRatio, color: "#9C27B0" },
                { name: "Absent", value: 100 - attendanceRatio, color: "#F44336" },
            ]);
        }
    }, [nonAcadamicApiDataCricket, nonAcadamicApiDataBasketball, nonAcadamicApiDataScienceClub, nonAcadamicApiDataMaths]);

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
            height: '100%',
            backgroundColor: '#EFF3FF', // Change this to your desired background color
            p: 2, // Optional: adds padding
        }}>
            <Paper
                sx={{
                    height: 321,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 2,
                    paddingBottom: 1,
                    borderRadius: '10px',
                    position: 'relative',
                    boxShadow: 'none'
                }}
            >
                <Typography variant="h5" sx={{ mb: '20px' }}>
                    Non-Academic
                </Typography>

                <Box sx={{
                    paddingX: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '2px',
                    height: '100%',
                    width: '100%',
                    overflowX: 'auto', // Added overflowX to the inner Box
                    '&::-webkit-scrollbar': {
                        height: 6, // scrollbar height
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#00CADC', // scrollbar color
                        borderRadius: 3,
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f0f0f0', // track color
                        borderRadius: 3,
                        margin: '0 8px', // <--- small margin inside the track
                    }
                }}>
                    {/* for Cricket */}
                    {subjectList.includes("SUB001") && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <CustomDropdown
                                    value={nonAcadamicDataCricketPeriod}
                                    onChange={handlenonAcadamicDataCricketPeriodChange}
                                    menuItems={nonAcadamicDataCricketPeriodOptions}
                                />
                            </div>
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <DoughnutChart data={nonAcademicDataCricket} />
                                {renderPercentageLabels(nonAcademicDataCricket)}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <Typography variant="h5">Cricket</Typography>
                            </div>
                        </Box>
                    )}

                    {/* for Basketball */}
                    {subjectList.includes("SUB002") && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <CustomDropdown
                                    value={nonAcadamicDataBasketballPeriod}
                                    onChange={handlenonAcadamicDataBasketballPeriodChange}
                                    menuItems={nonAcadamicDataBasketballPeriodOptions}
                                />
                            </div>
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <DoughnutChart data={nonAcademicDataBasketball} />
                                {renderPercentageLabels(nonAcademicDataBasketball)}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <Typography variant="h5">Basketball</Typography>
                            </div>
                        </Box>
                    )}

                    {/* for Science Club */}
                    {subjectList.includes("SUB003") && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <CustomDropdown
                                    value={nonAcadamicDataScienceClubPeriod}
                                    onChange={handlenonAcadamicDataScienceClubPeriodChange}
                                    menuItems={nonAcadamicDataScienceClubPeriodOptions}
                                />
                            </div>
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <DoughnutChart data={nonAcademicDataScienceClub} />
                                {renderPercentageLabels(nonAcademicDataScienceClub)}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <Typography variant="h5">Science Club</Typography>
                            </div>
                        </Box>
                    )}

                    {/* for Maths Club */}
                    {subjectList.includes("SUB004") && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <CustomDropdown
                                    value={nonAcadamicDataMathsPeriod}
                                    onChange={handlenonAcadamicDataMathsPeriodChange}
                                    menuItems={nonAcadamicDataMathsPeriodOptions}
                                />
                            </div>
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <DoughnutChart data={nonAcademicDataMaths} />
                                {renderPercentageLabels(nonAcademicDataMaths)}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <Typography variant="h5">Maths Club</Typography>
                            </div>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default NonAcadamicRatio;
