import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import DoughnutChart from './DoughnutChart';
import CustomDropdown from './CustomDropdown';
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
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        zIndex: 1
    }}>
        <Typography variant="h6" color="text.secondary">👀</Typography>
        <Typography variant="body1" color="text.secondary">Data not found</Typography>
    </Box>
);

const DEFAULT_CHART_DATA = [
    { name: "Present", value: null, color: "#9C27B0" },
    { name: "Absent", value: null, color: "#F44336" },
];

const PERIOD_OPTIONS = [
    { label: 'Year-to-Date', value: 'Yearly' },
    { label: 'Month-to-Date', value: 'Monthly' },
    { label: 'Today', value: 'Daily' },
];

const SubjectAttendanceChart = ({ subjectId, subjectData, period, onPeriodChange }) => {
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
                    {entry.name}<br />{parseFloat(entry.value).toFixed(2)}%
                </div>
            ))}
        </div>
    );

    const hasValidData = subjectData && subjectData.every(d => typeof d.value === 'number');

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 230,
        }}>
            <div style={{ marginBottom: '20px' }}>
                <CustomDropdown
                    value={period}
                    onChange={(e) => onPeriodChange(subjectId, e.target.value)}
                    menuItems={PERIOD_OPTIONS}
                />
            </div>
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {hasValidData ? (
                    <>
                        <DoughnutChart data={subjectData} />
                        {renderPercentageLabels(subjectData)}
                    </>
                ) : <NoDataMessage />}
            </div>
            <div style={{ marginTop: '10px' }}>
                <Typography variant="h6">{getSubjectName(subjectId)}</Typography>
            </div>
        </Box>
    );
};

const NonAcadamicRatio = ({ studentId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [subjectList, setSubjectList] = useState([]);
    const [subjectsData, setSubjectsData] = useState({});

    const fetchSubjects = async () => {
        try {
            const response = await fetch(`${attendanceModuleUrl}/non-acadamic/subjects/${studentId}`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            return data.subject_ids || [];
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
                `${attendanceModuleUrl}/student/nonacademic/ratio?student_id=${studentId}&subject_id=${subject}&summary_type=${summaryType.toLowerCase()}`
            );

            if (!response.ok) {
                console.warn(`No data for subject ${subject}`);
                throw new Error('No data');
            }

            const data = await response.json();
            const ratio = data?.data?.attendance_ratio;

            if (typeof ratio === 'number') {
                setSubjectsData(prev => ({
                    ...prev,
                    [subject]: {
                        ...prev[subject],
                        chartData: [
                            { name: "Present", value: ratio, color: "#9C27B0" },
                            { name: "Absent", value: 100 - ratio, color: "#F44336" },
                        ]
                    }
                }));
            } else {
                // No valid data
                setSubjectsData(prev => ({
                    ...prev,
                    [subject]: {
                        ...prev[subject],
                        chartData: DEFAULT_CHART_DATA
                    }
                }));
            }
        } catch (error) {
            console.error(`Error fetching data for ${subject}:`, error);
            setSubjectsData(prev => ({
                ...prev,
                [subject]: {
                    ...prev[subject],
                    chartData: DEFAULT_CHART_DATA
                }
            }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            const subjects = await fetchSubjects();
            setSubjectList(subjects);

            const initial = subjects.reduce((acc, subject) => ({
                ...acc,
                [subject]: {
                    period: 'Yearly',
                    chartData: DEFAULT_CHART_DATA
                }
            }), {});
            setSubjectsData(initial);

            subjects.forEach(subject => fetchAttendanceData(subject, 'Yearly'));
        };

        loadInitialData();
    }, [studentId]);

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
        <Box sx={{ height: '100%', backgroundColor: '#EFF3FF', p: 2 }}>
            <Paper sx={{
                height: 321,
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
                    Non-Academic
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '2px',
                    height: '100%',
                    width: '100%',
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': { height: 6 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#00CADC', borderRadius: 3 },
                    '&::-webkit-scrollbar-track': { backgroundColor: '#f0f0f0', borderRadius: 3, margin: '0 8px' },
                }}>
                    {subjectList.length > 0 ? (
                        subjectList.map(subjectId => (
                            <SubjectAttendanceChart
                                key={subjectId}
                                subjectId={subjectId}
                                subjectData={subjectsData[subjectId]?.chartData || DEFAULT_CHART_DATA}
                                period={subjectsData[subjectId]?.period || 'Yearly'}
                                onPeriodChange={handlePeriodChange}
                            />
                        ))
                    ) : !loading && (
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 4
                        }}>
                            <NoDataMessage />
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default NonAcadamicRatio;
