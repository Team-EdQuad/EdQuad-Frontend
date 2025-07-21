import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  TextField,
  useTheme,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { LineChart, MarkPlot } from '@mui/x-charts';
import { StoreContext } from '../context/StoreContext';

const Url = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

const BehavioralAnalysis = () => {
  const theme = useTheme();
  const { id: teacher_id } = useContext(StoreContext);
  const API_BASE_URL = `${Url}/api`;

  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [subjectsGrades, setSubjectsGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  
  const [expectedContentCount, setExpectedContentCount] = useState('');
  const [assignmentAvailable, setAssignmentAvailable] = useState('');

  const [avgActiveTime, setAvgActiveTime] = useState(0);
  const [avgTimeSpent, setAvgTimeSpent] = useState(0);
  const [avgAccessFrequency, setAvgAccessFrequency] = useState(0);
  const [predictedData, setPredictedData] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  const [weekRange, setWeekRange] = useState(12);
  const [chartData, setChartData] = useState({
    xAxisData: [],
    series: [],
  });

  useEffect(() => {
    const fetchSubjectsAndGrades = async () => {
      if (!teacher_id) return;
      try {
        setInitialLoading(true);
        const response = await axios.get(`${API_BASE_URL}/subjectNclass/${teacher_id}`);
        setSubjectsGrades(response.data.subjects_classes || []);
        setError('');
      } catch (err) {
        console.error('Error fetching subjects and grades:', err);
        setError('Failed to load subjects and grades. Please ensure the backend server is running and reachable.');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchSubjectsAndGrades();
  }, [teacher_id, API_BASE_URL]);

  useEffect(() => {
    if (subject && grade) {
      const selectedSubject = subjectsGrades.find((item) => item.subject_name === subject);
      const selectedGrade = selectedSubject?.classes.find((cls) => cls.class_name === grade);
      if (selectedSubject?.subject_id && selectedGrade?.class_id) {
        fetchVisualizationData(selectedSubject.subject_id, selectedGrade.class_id, predictedData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekRange, subject, grade]);

  const handleSubjectChange = (event) => {
    const selectedSubjectName = event.target.value;
    setSubject(selectedSubjectName);
    setGrade('');
    setFilteredGrades(subjectsGrades.find((s) => s.subject_name === selectedSubjectName)?.classes || []);
    resetData();
  };

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
    resetData();
  };
  
  const resetData = () => {
      setError('');
      setPredictedData(null);
      setChartData({ xAxisData: [], series: [] });
      setAvgActiveTime(0);
      setAvgTimeSpent(0);
      setAvgAccessFrequency(0);
  }

  
  const fetchVisualizationData = async (subject_id, class_id, currentPrediction = null) => {
    try {
      setChartLoading(true);
      const response = await axios.get(`${API_BASE_URL}/visualize_data/${subject_id}/${class_id}`);
      
      if (response.data && Array.isArray(response.data.x) && Array.isArray(response.data.y)) {
        let xData = response.data.x.map(Number);
        let yData = response.data.y.map(Number);

        if (xData.length > weekRange) {
          xData = xData.slice(-weekRange);
          yData = yData.slice(-weekRange);
        }
        
        let series;
        let finalXData = [...xData];
        const finalPrediction = currentPrediction || predictedData;

        if (finalPrediction && xData.length > 0) {
            const nextWeek = xData.length > 0 ? xData[xData.length - 1] + 1 : 1;
            finalXData.push(nextWeek);
            
            const historicalSegment = {
                data: [...yData, null],
                label: 'Historical Active Time (mins)',
                color: theme.palette.primary.main,
                
            };

            const predictionSegment = {
                data: [
                    ...Array(yData.length - 1).fill(null),
                    yData[yData.length - 1],
                    finalPrediction.predicted_active_time
                ],
                label: 'Predicted Active Time (mins)',
                color: theme.palette.error.main,
                strokeDasharray: '8 4',
            };
            series = [historicalSegment, predictionSegment];
        } else {
            series = [{
                data: yData,
                label: 'Historical Active Time (mins)',
                color: theme.palette.primary.main,
            }];
        }
        setChartData({ xAxisData: finalXData, series });
      } else {
        setChartData({ xAxisData: [], series: [] });
      }
    } catch (err) {
      console.error('Error fetching visualization data:', err);
      setError('Failed to fetch chart data.');
      setChartData({ xAxisData: [], series: [] });
    } finally {
      setChartLoading(false);
    }
  };

  const handleSubmit = async () => {
  const selectedSubjectObj = subjectsGrades.find((item) => item.subject_name === subject);
  const selectedGradeObj = selectedSubjectObj?.classes.find((cls) => cls.class_name === grade);
  const subject_id = selectedSubjectObj?.subject_id;
  const class_id = selectedGradeObj?.class_id;

  if (!subject_id || !class_id || !expectedContentCount || !assignmentAvailable) {
    setError('Please select a subject, grade, and provide all prediction inputs.');
    return;
  }
  const contentCount = Number(expectedContentCount);
  if (isNaN(contentCount) || contentCount < 0) {
    setError('Expected Content Count must be a valid non-negative number.');
    return;
  }

  setLoading(true);
  setError('');

  try {
    
    await axios.post(`${API_BASE_URL}/update_collection/${subject_id}/${class_id}`);

    const [timeSpentResponse, activeTimeResponse, accessFrequencyResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/TimeSpendOnResources/${subject_id}/${class_id}`),
      axios.get(`${API_BASE_URL}/SiteAverageActiveTime/${class_id}`),
      axios.get(`${API_BASE_URL}/ResourceAccessFrequency/${subject_id}/${class_id}`),
    ]);

    setAvgTimeSpent(timeSpentResponse.data.avgTimeSpentPerStudent || 0);
    setAvgActiveTime(activeTimeResponse.data.siteAverageActiveTimePerStudent || 0);
    setAvgAccessFrequency(accessFrequencyResponse.data.avgAccessPerStudentInClass || 0);

    const requestBody = {
        SpecialEventThisWeek: assignmentAvailable === 'Yes' ? 1 : 0,
        ResourcesUploadedThisWeek: contentCount
    };
    
    const predictResponse = await axios.post(
      `${API_BASE_URL}/predict_active_time/${subject_id}/${class_id}`,
      requestBody
    );

    const newPrediction = predictResponse.data;
    setPredictedData(newPrediction);
    await fetchVisualizationData(subject_id, class_id, newPrediction);

  } catch (err) {
    console.error('Error during analysis:', err);
    if (err.response) {
      const status = err.response.status;
      let message = 'An unknown server error occurred.';
      
      if (err.response.data && typeof err.response.data.detail === 'object') {
          message = JSON.stringify(err.response.data.detail);
      } else if (err.response.data && err.response.data.detail) {
          message = err.response.data.detail;
      }
      setError(`Error ${status}: ${message}. Please check your inputs or API status.`);
    } else if (err.request) {
      setError('Network Error: Could not connect to the server. Please check your connection and the backend status.');
    } else {
      setError(`An unexpected error occurred: ${err.message}`);
    }
    setPredictedData(null); 
  } finally {
    setLoading(false);
  }
};


  const handleTrainModel = async () => {
    setLoading(true);
    setError('');
    try {
      // Get selected subject and class IDs
      const selectedSubjectObj = subjectsGrades.find((item) => item.subject_name === subject);
      const selectedGradeObj = selectedSubjectObj?.classes.find((cls) => cls.class_name === grade);
      const subject_id = selectedSubjectObj?.subject_id;
      const class_id = selectedGradeObj?.class_id;

      if (!subject_id || !class_id) {
        setError('Please select a subject and grade before training.');
        setLoading(false);
        return;
      }

      // 1. Update collection
      await axios.post(`${API_BASE_URL}/update_collection/${subject_id}/${class_id}`);

      // 2. Train model
      const trainRes = await axios.post(`${API_BASE_URL}/train/${subject_id}/${class_id}`);

      alert(trainRes.data.message || 'Model training completed!');
      setError('');
    } catch (err) {
      setError('Failed to update data or train model.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /><Typography sx={{ml: 2}}>Loading dashboard...</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>📊 Behavioral Analysis Dashboard</Typography>
      {error && <Alert severity="error" sx={{ mb: 2, wordBreak: 'break-word' }}>{error}</Alert>}
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>🎯 Select Parameters for Prediction</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <FormControl sx={{minWidth: 200, flexGrow: 1}}>
                <InputLabel>Select Subject</InputLabel>
                <Select value={subject} label="Select Subject" onChange={handleSubjectChange}>
                  {subjectsGrades.map((sub) => (
                    <MenuItem key={sub.subject_id} value={sub.subject_name}>{sub.subject_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{minWidth: 200, flexGrow: 1}} disabled={!subject}>
                <InputLabel>Select Grade</InputLabel>
                <Select value={grade} label="Select Grade" onChange={handleGradeChange}>
                  {filteredGrades.map((cls) => (
                    <MenuItem key={cls.class_id} value={cls.class_name}>{cls.class_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
               <TextField
                    sx={{minWidth: 200, flexGrow: 1}}
                    label="Expected Content Uploads"
                    value={expectedContentCount}
                    onChange={(e) => setExpectedContentCount(e.target.value)}
                    type="number"
                    disabled={!grade}
                />
                <FormControl sx={{minWidth: 220, flexGrow: 1}} disabled={!grade}>
                    <InputLabel>Assignment Next Week</InputLabel>
                    <Select value={assignmentAvailable} label="Assignment Next Week" onChange={(e) => setAssignmentAvailable(e.target.value)}>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleTrainModel}
              disabled={loading}
            >
              Train Model
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !grade || !subject || !expectedContentCount || !assignmentAvailable}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Analyzing...' : 'Analyze & Predict Behavior'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card><CardContent><AccessTimeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} /><Typography variant="h6">Avg. Daily Active Time</Typography><Typography variant="h4">{avgActiveTime.toFixed(2)} mins</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card><CardContent><InsertChartIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} /><Typography variant="h6">Avg. Time Spent on Resources</Typography><Typography variant="h4">{avgTimeSpent.toFixed(2)} mins</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Card><CardContent><TrendingUpIcon color="success" sx={{ fontSize: 40, mb: 1 }} /><Typography variant="h6">Avg. Resource Access Frequency</Typography><Typography variant="h4">{Math.round(avgAccessFrequency)} /day</Typography></CardContent></Card>
        </Grid>
      </Grid>
      
      <Card>
        <CardContent>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
                <Typography variant="h6">📈 Weekly Active Time On Resources</Typography>
                <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                    <InputLabel>Time Range</InputLabel>
                    <Select value={weekRange} label="Time Range" onChange={(e) => setWeekRange(Number(e.target.value))}>
                        <MenuItem value={4}>Last month</MenuItem><MenuItem value={8}>Last 2 months</MenuItem><MenuItem value={12}>Last 3 months</MenuItem><MenuItem value={24}>Last 6 months</MenuItem>
                    </Select>
                </FormControl>
            </Box>
          {chartLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}><CircularProgress /><Typography sx={{ ml: 2 }}>Loading chart data...</Typography></Box>
          ) : chartData.xAxisData.length > 0 && chartData.series.length > 0 ? (
            <Box sx={{ height: 400, width: '100%' }}>
               <LineChart
              width={850}
              height={400}
              series={chartData.series}
              xAxis={[{ scaleType: 'linear', data: chartData.xAxisData, label: 'Week Number' }]}
              yAxis={[{ label: 'Total Active Time (minutes)' }]}
              margin={{ left: 80, right: 30, top: 30, bottom: 80 }}
              grid={{ vertical: true, horizontal: true }}
              skipAnimation={chartData.xAxisData.length > 20}
            />

        </Box>
          ) : (
            <Box sx={{ textAlign: 'center', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="text.secondary">Please select a subject and grade to view the active time trend.</Typography></Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BehavioralAnalysis;
