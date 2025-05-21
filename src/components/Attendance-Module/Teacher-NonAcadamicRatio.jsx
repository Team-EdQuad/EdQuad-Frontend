import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import DoughnutChart from './DoughnutChart';
import CustomDropdown from './CustomDropdown';

const NonAcademicRatio = ({ classId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [subjectList, setSubjectList] = useState(['SUB001', 'SUB002', 'SUB003', 'SUB004']);

    // for Cricket
    const [nonAcademicDataCricket, setNonAcademicDataCricket] = useState([
        { name: "Present", value: null, color: "#9C27B0" },
        { name: "Absent", value: null, color: "#F44336" },
    ]);
    const [nonAcademicApiDataCricket, setNonAcademicApiDataCricket] = useState(null);
    const [nonAcademicDataCricketPeriod, setNonAcademicDataCricketPeriod] = useState('Yearly');

    // for Basketball
    const [nonAcademicDataBasketball, setNonAcademicDataBasketball] = useState([
        { name: "Present", value: null, color: "#9C27B0" },
        { name: "Absent", value: null, color: "#F44336" },
    ]);
    const [nonAcademicApiDataBasketball, setNonAcademicApiDataBasketball] = useState(null);
    const [nonAcademicDataBasketballPeriod, setNonAcademicDataBasketballPeriod] = useState('Yearly');

    // for Science Club
    const [nonAcademicDataScienceClub, setNonAcademicDataScienceClub] = useState([
        { name: "Present", value: null, color: "#9C27B0" },
        { name: "Absent", value: null, color: "#F44336" },
    ]);
    const [nonAcademicApiDataScienceClub, setNonAcademicApiDataScienceClub] = useState(null);
    const [nonAcademicDataScienceClubPeriod, setNonAcademicDataScienceClubPeriod] = useState('Yearly');

    // for Maths Club
    const [nonAcademicDataMaths, setNonAcademicDataMaths] = useState([
        { name: "Present", value: null, color: "#9C27B0" },
        { name: "Absent", value: null, color: "#F44336" },
    ]);
    const [nonAcademicApiDataMaths, setNonAcademicApiDataMaths] = useState(null);
    const [nonAcademicDataMathsPeriod, setNonAcademicDataMathsPeriod] = useState('Yearly');

    const periodOptions = [
        { label: 'Yearly', value: 'Yearly' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Daily', value: 'Daily' },
    ];

    const fetchSubjects = async (classId) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/attendance/class/subjects/${classId}`
            );

            if (!response.ok) {
                console.warn(`API returned ${response.status}. Using default subjects.`);
                return ['SUB001', 'SUB002', 'SUB003', 'SUB004'];
            }

            const data = await response.json();
            return data.subject_ids || ['SUB001', 'SUB002', 'SUB003', 'SUB004'];
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
            return ['SUB001', 'SUB002', 'SUB003', 'SUB004'];
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const subjects = await fetchSubjects(classId);
                setSubjectList(subjects);
                
                // Fetch data for each subject with their respective periods
                if (subjects.includes('SUB001')) {
                    await fetchAttendanceData('SUB001', nonAcademicDataCricketPeriod);
                }
                if (subjects.includes('SUB002')) {
                    await fetchAttendanceData('SUB002', nonAcademicDataBasketballPeriod);
                }
                if (subjects.includes('SUB003')) {
                    await fetchAttendanceData('SUB003', nonAcademicDataScienceClubPeriod);
                }
                if (subjects.includes('SUB004')) {
                    await fetchAttendanceData('SUB004', nonAcademicDataMathsPeriod);
                }
            } catch (err) {
                console.error("Failed to load initial data:", err);
                setError(err);
            }
        };

        loadInitialData();
    }, [
        classId,
        nonAcademicDataCricketPeriod,
        nonAcademicDataBasketballPeriod,
        nonAcademicDataScienceClubPeriod,
        nonAcademicDataMathsPeriod
    ]);

    const fetchAttendanceData = async (subject, summaryType) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/attendance/class/nonacademic/ratio?class_id=${classId}&subject_id=${subject}&summary_type=${summaryType.toLowerCase()}`
            );
            
            if (!response.ok) {
                console.warn(`API returned ${response.status}. Using default data.`);
                const defaultData = {
                    data: {
                        attendance_ratio: 0.75
                    }
                };
                
                switch(subject) {
                    case 'SUB001':
                        setNonAcademicApiDataCricket(defaultData.data);
                        break;
                    case 'SUB002':
                        setNonAcademicApiDataBasketball(defaultData.data);
                        break;
                    case 'SUB003':
                        setNonAcademicApiDataScienceClub(defaultData.data);
                        break;
                    case 'SUB004':
                        setNonAcademicApiDataMaths(defaultData.data);
                        break;
                }
                return;
            }
            
            const data = await response.json();
            
            switch(subject) {
                case 'SUB001':
                    setNonAcademicApiDataCricket(data.data);
                    break;
                case 'SUB002':
                    setNonAcademicApiDataBasketball(data.data);
                    break;
                case 'SUB003':
                    setNonAcademicApiDataScienceClub(data.data);
                    break;
                case 'SUB004':
                    setNonAcademicApiDataMaths(data.data);
                    break;
            }
        } catch (error) {
            console.error(`Error fetching data for ${subject}:`, error);
            const defaultData = {
                data: {
                    attendance_ratio: 0.75
                }
            };
            
            switch(subject) {
                case 'SUB001':
                    setNonAcademicApiDataCricket(defaultData.data);
                    break;
                case 'SUB002':
                    setNonAcademicApiDataBasketball(defaultData.data);
                    break;
                case 'SUB003':
                    setNonAcademicApiDataScienceClub(defaultData.data);
                    break;
                case 'SUB004':
                    setNonAcademicApiDataMaths(defaultData.data);
                    break;
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (nonAcademicApiDataCricket) {
            const attendanceRatio = nonAcademicApiDataCricket.attendance_ratio * 100;
            setNonAcademicDataCricket([
                { name: "Present", value: attendanceRatio, color: "#9C27B0" },
                { name: "Absent", value: 100 - attendanceRatio, color: "#F44336" },
            ]);
        }
        if (nonAcademicApiDataBasketball) {
            const attendanceRatio = nonAcademicApiDataBasketball.attendance_ratio * 100;
            setNonAcademicDataBasketball([
                { name: "Present", value: attendanceRatio, color: "#9C27B0" },
                { name: "Absent", value: 100 - attendanceRatio, color: "#F44336" },
            ]);
        }
        if (nonAcademicApiDataScienceClub) {
            const attendanceRatio = nonAcademicApiDataScienceClub.attendance_ratio * 100;
            setNonAcademicDataScienceClub([
                { name: "Present", value: attendanceRatio, color: "#9C27B0" },
                { name: "Absent", value: 100 - attendanceRatio, color: "#F44336" },
            ]);
        }
        if (nonAcademicApiDataMaths) {
            const attendanceRatio = nonAcademicApiDataMaths.attendance_ratio * 100;
            setNonAcademicDataMaths([
                { name: "Present", value: attendanceRatio, color: "#9C27B0" },
                { name: "Absent", value: 100 - attendanceRatio, color: "#F44336" },
            ]);
        }
    }, [
        nonAcademicApiDataCricket,
        nonAcademicApiDataBasketball,
        nonAcademicApiDataScienceClub,
        nonAcademicApiDataMaths
    ]);

    const renderPercentageLabels = (data) => {
        return (
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    fontSize: "12px",
                    zIndex: 1,
                    pointerEvents: "none",
                }}
            >
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
                        {entry.value}%
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Box sx={{
            height: '100%',
            backgroundColor: '#EFF3FF',
            p: 2,
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
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                        height: 6,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#00CADC',
                        borderRadius: 3,
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f0f0f0',
                        borderRadius: 3,
                        margin: '0 8px',
                    }
                }}>
                    {/* Cricket */}
                    {subjectList.includes("SUB001") && (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            minWidth: '200px',
                            flex: 1
                        }}>
                            <div style={{ marginBottom: '20px' }}>
                                <CustomDropdown
                                    value={nonAcademicDataCricketPeriod}
                                    onChange={(e) => setNonAcademicDataCricketPeriod(e.target.value)}
                                    menuItems={periodOptions}
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

                    {/* Basketball */}
                    {subjectList.includes("SUB002") && (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            minWidth: '200px',
                            flex: 1
                        }}>
                            <div style={{ marginBottom: '20px' }}>
                                <CustomDropdown
                                    value={nonAcademicDataBasketballPeriod}
                                    onChange={(e) => setNonAcademicDataBasketballPeriod(e.target.value)}
                                    menuItems={periodOptions}
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

                    {/* Science Club */}
                    {subjectList.includes("SUB003") && (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            minWidth: '200px',
                            flex: 1
                        }}>
                            <div style={{ marginBottom: '20px' }}>
                                <CustomDropdown
                                    value={nonAcademicDataScienceClubPeriod}
                                    onChange={(e) => setNonAcademicDataScienceClubPeriod(e.target.value)}
                                    menuItems={periodOptions}
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

                    {/* Maths Club */}
                    {subjectList.includes("SUB004") && (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            minWidth: '200px',
                            flex: 1
                        }}>
                            <div style={{ marginBottom: '20px' }}>
                                <CustomDropdown
                                    value={nonAcademicDataMathsPeriod}
                                    onChange={(e) => setNonAcademicDataMathsPeriod(e.target.value)}
                                    menuItems={periodOptions}
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

export default NonAcademicRatio;