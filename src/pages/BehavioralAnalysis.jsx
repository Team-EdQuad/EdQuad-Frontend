import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BehavioralAnalysis = () => {
  const theme = useTheme();
  const teacher_id = "TCH001"; // Example teacher ID, adjust as needed
  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  // State
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [subjectsGrades, setSubjectsGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [expectedContentCount, setExpectedContentCount] = useState('');
  const [assignmentAvailable, setAssignmentAvailable] = useState('');
  const [avgActiveTime, setAvgActiveTime] = useState(0);
  const [avgTimeSpent, setAvgTimeSpent] = useState(0);
  const [avgAccessFrequency, setAvgAccessFrequency] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Sample data for the chart (to be updated with API data if needed)
  const [chartData, setChartData] = useState([
    { name: 'Mon', engagement: 45, frequency: 15 },
    { name: 'Tue', engagement: 50, frequency: 18 },
    { name: 'Wed', engagement: 60, frequency: 20 },
    { name: 'Thu', engagement: 40, frequency: 12 },
    { name: 'Fri', engagement: 50, frequency: 15 },
  ]);

  // Axios interceptors for debugging
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        console.log('Making request to:', config.url);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        console.log('Response received from:', response.config.url);
        return response;
      },
      (error) => {
        console.error('Response error:', error);
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Fetch subjects and grades from API
  useEffect(() => {
    const fetchSubjectsAndGrades = async () => {
      try {
        setInitialLoading(true);
        const response = await axios.get(`${API_BASE_URL}/subjectNclass/${teacher_id}`);
        setSubjectsGrades(response.data.subjects_classes);
        setError('');
      } catch (error) {
        console.error('Error fetching subjects and grades:', error);
        setError('Failed to load subjects and grades. Please check if the server is running.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchSubjectsAndGrades();
  }, [teacher_id]);

  // Handle subject change
  const handleSubjectChange = (event) => {
    const selectedSubject = event.target.value;
    setSubject(selectedSubject);
    setGrade(''); // Reset grade selection
    setAssignmentAvailable(''); // Reset assignment available
    setError(''); // Clear error

    const selected = subjectsGrades.find((item) => item.subject_name === selectedSubject);
    setFilteredGrades(selected ? selected.classes : []);
  };

  // Handle grade change
  const handleGradeChange = (event) => {
    setGrade(event.target.value);
    setError(''); // Clear error
  };

  // Handle input changes
  const handleExpectedContentCountChange = (event) => {
    setExpectedContentCount(event.target.value);
    setError(''); // Clear error
  };

  // Handle assignment available change
  const handleAssignmentAvailableChange = (event) => {
    setAssignmentAvailable(event.target.value);
    setError(''); // Clear error
  };

  // Handle submit
  const handleSubmit = async () => {
    const selectedSubject = subjectsGrades.find((item) => item.subject_name === subject);
    const selectedGrade = selectedSubject?.classes.find((cls) => cls.class_name === grade);

    const subject_id = selectedSubject?.subject_id;
    const class_id = selectedGrade?.class_id;

    if (!subject_id || !class_id) {
      setError('Invalid subject or grade selection.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Make all requests in parallel for better performance
      const [timeSpentResponse, activeTimeResponse, accessFrequencyResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/TimeSpendOnResources/${subject_id}/${class_id}`),
        axios.get(`${API_BASE_URL}/SiteAverageActiveTime/${class_id}`),
        axios.get(`${API_BASE_URL}/ResourceAccessFrequency/${subject_id}/${class_id}`)
      ]);

      // Update state with API responses
      setAvgTimeSpent(timeSpentResponse.data.avgTimeSpentPerStudent || 0);
      setAvgActiveTime(activeTimeResponse.data.siteAverageActiveTimePerStudent || 0);
      setAvgAccessFrequency(accessFrequencyResponse.data.avgAccessPerStudentInClass || 0);

      // Optionally update chart data based on the metrics
      const newChartData = [
        { name: 'Mon', engagement: Math.round(timeSpentResponse.data.avgTimeSpentPerStudent * 0.8), frequency: Math.round(accessFrequencyResponse.data.avgAccessPerStudentInClass * 3) },
        { name: 'Tue', engagement: Math.round(timeSpentResponse.data.avgTimeSpentPerStudent * 0.9), frequency: Math.round(accessFrequencyResponse.data.avgAccessPerStudentInClass * 3.2) },
        { name: 'Wed', engagement: Math.round(timeSpentResponse.data.avgTimeSpentPerStudent * 1.1), frequency: Math.round(accessFrequencyResponse.data.avgAccessPerStudentInClass * 3.5) },
        { name: 'Thu', engagement: Math.round(timeSpentResponse.data.avgTimeSpentPerStudent * 0.7), frequency: Math.round(accessFrequencyResponse.data.avgAccessPerStudentInClass * 2.8) },
        { name: 'Fri', engagement: Math.round(timeSpentResponse.data.avgTimeSpentPerStudent * 0.85), frequency: Math.round(accessFrequencyResponse.data.avgAccessPerStudentInClass * 3.1) },
      ];
      setChartData(newChartData);

      console.log('Data fetched successfully:', {
        subject,
        grade,
        subject_id,
        class_id,
        expectedContentCount,
        assignmentAvailable,
        avgTimeSpent: timeSpentResponse.data.avgTimeSpentPerStudent,
        avgActiveTime: activeTimeResponse.data.siteAverageActiveTimePerStudent,
        avgAccessFrequency: accessFrequencyResponse.data.avgAccessPerStudentInClass
      });
    } catch (error) {
      console.error('Detailed error:', error);
      
      if (error.response) {
        // Server responded with error status
        setError(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        // Request made but no response received
        setError('No response from server. Please check if the server is running on port 8000.');
      } else {
        // Something else happened
        setError(`Request error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor={theme.palette.background.default}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" mt={2} color={theme.palette.text.secondary}>
          Loading subjects and grades...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor={theme.palette.background.default}
      minHeight="100vh"
      p={3}
    >
      <Typography variant="h4" fontWeight="bold" mb={4} sx={{ color: theme.palette.text.primary }}>
        📊 Behavioral Analysis Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: '900px' }}>
          {error}
        </Alert>
      )}

      {/* Filters Section */}
      <Card sx={{ width: '100%', maxWidth: '900px', mb: 3, p: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: theme.palette.text.primary }}>
          🎯 Select Parameters
        </Typography>
        
        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          {/* Subject Dropdown */}
          <FormControl sx={{ minWidth: '200px', flex: 1 }}>
            <InputLabel sx={{ color: theme.palette.text.secondary }}>Select Subject</InputLabel>
            <Select
              value={subject}
              onChange={handleSubjectChange}
              sx={{ color: theme.palette.text.primary }}
            >
              {subjectsGrades.map((sub) => (
                <MenuItem key={sub.subject_id} value={sub.subject_name}>
                  {sub.subject_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Grade Dropdown */}
          <FormControl sx={{ minWidth: '200px', flex: 1 }}>
            <InputLabel sx={{ color: theme.palette.text.secondary }}>Select Grade</InputLabel>
            <Select
              value={grade}
              onChange={handleGradeChange}
              sx={{ color: theme.palette.text.primary }}
              disabled={!filteredGrades.length}
            >
              {filteredGrades.map((cls) => (
                <MenuItem key={cls.class_id} value={cls.class_name}>
                  {cls.class_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          {/* Expected Content Count Input */}
          <TextField
            label="Expected Content Count for Next Week"
            type="number"
            value={expectedContentCount}
            onChange={handleExpectedContentCountChange}
            sx={{ minWidth: '200px', flex: 1 }}
            InputLabelProps={{ sx: { color: theme.palette.text.secondary } }}
            InputProps={{ sx: { color: theme.palette.text.primary } }}
          />

          {/* Assignment Available Dropdown */}
          <FormControl sx={{ minWidth: '200px', flex: 1 }}>
            <InputLabel sx={{ color: theme.palette.text.secondary }}>Assignment Available Next Week</InputLabel>
            <Select
              value={assignmentAvailable}
              onChange={handleAssignmentAvailableChange}
              sx={{ color: theme.palette.text.primary }}
              disabled={!subject || !grade}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Submit Button */}
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!subject || !grade || !expectedContentCount || !assignmentAvailable || loading}
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              '&:disabled': {
                backgroundColor: theme.palette.action.disabled,
              },
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <TrendingUpIcon />}
          >
            {loading ? 'Analyzing...' : 'Analyze Behavior'}
          </Button>
        </Box>
      </Card>

      {/* Metrics Cards */}
      <Box display="flex" flexWrap="wrap" gap={2} width="100%" maxWidth="900px" mb={4}>
        {/* Avg. Daily Active Time */}
        <Card sx={{ flex: 1, minWidth: '250px' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <AccessTimeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Avg. Daily Active Time
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color={theme.palette.primary.main}>
              {avgActiveTime} <span style={{ fontSize: '1rem' }}>mins</span>
            </Typography>
            <Typography variant="body2" color={theme.palette.text.secondary} mt={1}>
              Time students spend actively on the platform
            </Typography>
          </CardContent>
        </Card>

        {/* Time Spent on Resources */}
        <Card sx={{ flex: 1, minWidth: '250px' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <AccessTimeIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Time Spent on Resources
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color={theme.palette.secondary.main}>
              {avgTimeSpent} <span style={{ fontSize: '1rem' }}>mins</span>
            </Typography>
            <Typography variant="body2" color={theme.palette.text.secondary} mt={1}>
              Average time per student on learning materials
            </Typography>
          </CardContent>
        </Card>

        {/* Frequency of Resource Access */}
        <Card sx={{ flex: 1, minWidth: '250px' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <InsertChartIcon sx={{ mr: 1, color: theme.palette.success.main }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Resource Access Frequency
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color={theme.palette.success.main}>
              {avgAccessFrequency.toFixed(2)} <span style={{ fontSize: '1rem' }}>/day</span>
            </Typography>
            <Typography variant="body2" color={theme.palette.text.secondary} mt={1}>
              How often students access learning resources
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Engagement Trends Chart */}
      <Card sx={{ width: '100%', maxWidth: '900px', p: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: theme.palette.text.primary }}>
          📈 Weekly Engagement Trends
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="name" 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="engagement" 
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
              name="Engagement (mins)"
            />
            <Line 
              type="monotone" 
              dataKey="frequency" 
              stroke={theme.palette.secondary.main}
              strokeWidth={3}
              dot={{ fill: theme.palette.secondary.main, strokeWidth: 2, r: 6 }}
              name="Access Frequency"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Additional Insights */}
      {(avgActiveTime > 0 || avgTimeSpent > 0 || avgAccessFrequency > 0) && (
        <Card sx={{ width: '100%', maxWidth: '900px', mt: 3, p: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: theme.palette.text.primary }}>
            💡 Insights & Recommendations
          </Typography>
          <Box>
            {avgActiveTime < 30 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Low daily active time detected. Consider implementing more engaging content or interactive elements.
              </Alert>
            )}
            {avgAccessFrequency < 1 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Students are accessing resources less than once per day. Consider sending reminders or creating more compelling content.
              </Alert>
            )}
            {avgTimeSpent > 60 && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Excellent! Students are spending significant time on learning resources.
              </Alert>
            )}
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default BehavioralAnalysis;
