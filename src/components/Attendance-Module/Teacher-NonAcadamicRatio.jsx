import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import DoughnutChart from './DoughnutChart';
import CustomDropdown from './CustomDropdown';
import axios from 'axios';
const attendanceModuleUrl = import.meta.env.VITE_ATTENDANCE_MODULE_BACKEND_URL;

const DEFAULT_CHART_DATA = [
    { name: "Present", value: 0, color: "#9C27B0" },
    { name: "Absent", value: 0, color: "#F44336" },
];

const PERIOD_OPTIONS = [
    { label: 'Yearly', value: 'Yearly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Daily', value: 'Daily' },
];

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

const SubjectAttendanceChart = ({ subjectId, subjectData, period, onPeriodChange, hasData }) => {
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
                <div key={index} style={{
                    position: "absolute",
                    top: index === 0 ? "3%" : "70%",
                    left: index === 0 ? "3%" : "80%",
                    textAlign: "center",
                    color: entry.color,
                }}>
                    {entry.name}<br />{entry.value}%
                </div>
            ))}
        </div>
    );

    const renderNoData = () => (
        <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "14px",
            color: "#666",
            zIndex: 1,
        }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>👀</div>
            <div>No Data</div>
        </div>
    );

    return (
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
                    value={period}
                    onChange={(e) => onPeriodChange(subjectId, e.target.value)}
                    menuItems={PERIOD_OPTIONS}
                />
            </div>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <DoughnutChart data={subjectData} />
                {hasData ? renderPercentageLabels(subjectData) : renderNoData()}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <Typography variant="h5">{SUBJECT_NAMES[subjectId] || subjectId}</Typography>
            </div>
        </Box>
    );
};

const NonAcademicRatio = ({ classId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [subjectList, setSubjectList] = useState([]);
    const [subjectsData, setSubjectsData] = useState({});

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`${attendanceModuleUrl}/non-acadamic/subjects`);
            if (response.data && response.data.subject_ids) {
                return response.data.subject_ids;
            }
            throw new Error('No subject data received');
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
            return [];
        }
    };

    const fetchAttendanceData = async (subject, summaryType) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${attendanceModuleUrl}/class/nonacademic/ratio?class_id=${classId}&subject_id=${subject}&summary_type=${summaryType.toLowerCase()}`
            );
            
            if (!response.ok) {
                console.warn(`API returned ${response.status}. No data available.`);
                setSubjectsData(prev => ({
                    ...prev,
                    [subject]: {
                        ...prev[subject],
                        chartData: DEFAULT_CHART_DATA,
                        hasData: false
                    }
                }));
                return;
            }

            const data = await response.json();
            const attendanceRatio = data.data.attendance_ratio * 100;
            setSubjectsData(prev => ({
                ...prev,
                [subject]: {
                    ...prev[subject],
                    chartData: [
                        { name: "Present", value: attendanceRatio, color: "#9C27B0" },
                        { name: "Absent", value: 100 - attendanceRatio, color: "#F44336" },
                    ],
                    hasData: true
                }
            }));
        } catch (error) {
            console.error(`Error fetching data for ${subject}:`, error);
            setSubjectsData(prev => ({
                ...prev,
                [subject]: {
                    ...prev[subject],
                    chartData: DEFAULT_CHART_DATA,
                    hasData: false
                }
            }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const subjects = await fetchSubjects();
                setSubjectList(subjects);
                
                // Initialize subjects data with default values
                const initialData = subjects.reduce((acc, subject) => ({
                    ...acc,
                    [subject]: {
                        period: 'Yearly',
                        chartData: DEFAULT_CHART_DATA,
                        hasData: false
                    }
                }), {});
                setSubjectsData(initialData);

                // Fetch data for each subject
                subjects.forEach(subject => {
                    fetchAttendanceData(subject, 'Yearly');
                });
            } catch (err) {
                console.error("Failed to load initial data:", err);
                setError(err);
            }
        };

        loadInitialData();
    }, [classId]);

    const handlePeriodChange = (subjectId, newPeriod) => {
        setSubjectsData(prev => ({
            ...prev,
            [subjectId]: {
                ...prev[subjectId],
                period: newPeriod
            }
        }));
        fetchAttendanceData(subjectId, newPeriod);
    };

    return (
        <Box sx={{
            height: '100%',
            backgroundColor: '#EFF3FF',
            p: 2,
        }}>
            <Paper sx={{
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
            }}>
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
                    {subjectList.map(subjectId => (
                        <SubjectAttendanceChart
                            key={subjectId}
                            subjectId={subjectId}
                            subjectData={subjectsData[subjectId]?.chartData || DEFAULT_CHART_DATA}
                            period={subjectsData[subjectId]?.period || 'Yearly'}
                            onPeriodChange={handlePeriodChange}
                            hasData={subjectsData[subjectId]?.hasData || false}
                        />
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

export default NonAcademicRatio;







