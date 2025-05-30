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
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const BehavioralAnalysis = () => {
  const theme = useTheme();
  const teacher_id = "TCH001"; // Example teacher ID, adjust as needed

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

  // Sample data for the chart (to be updated with API data if needed)
  const [chartData, setChartData] = useState([
    { name: 'Mon', engagement: 45, frequency: 15 },
    { name: 'Tue', engagement: 50, frequency: 18 },
    { name: 'Wed', engagement: 60, frequency: 20 },
    { name: 'Thu', engagement: 40, frequency: 12 },
    { name: 'Fri', engagement: 50, frequency: 15 },
  ]);

  // Fetch subjects and grades from API
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/subjectNclass/${teacher_id}`)
      .then((response) => {
        setSubjectsGrades(response.data.subjects_classes);
      })
      .catch((error) => {
        console.error('Error fetching subjects and grades:', error);
        setError('Failed to load subjects and grades.');
      });
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

    try {
      // Fetch Time Spent on Resources
      const timeSpentResponse = await axios.get(
        `http://127.0.0.1:8005/TimeSpendOnResources/${subject_id}/${class_id}`
      );
      setAvgTimeSpent(timeSpentResponse.data.avgTimeSpentPerStudent || 0);

      // Fetch Site Average Active Time
      const activeTimeResponse = await axios.get(
        `http://127.0.0.1:8005/SiteAverageActiveTime/${class_id}`
      );
      setAvgActiveTime(activeTimeResponse.data.siteAverageActiveTimePerStudent || 0);

      // Fetch Resource Access Frequency
      const accessFrequencyResponse = await axios.get(
        `http://127.0.0.1:8005/ResourceAccessFrequency/${subject_id}/${class_id}`
      );
      setAvgAccessFrequency(accessFrequencyResponse.data.avgAccessPerStudentInClass || 0);

      // Optionally update chart data (example, modify based on API data if available)
      // setChartData([...]); // Update with API data if endpoint provides chart-compatible data

      setError('');
      console.log('Selected:', {
        subject,
        grade,
        subject_id,
        class_id,
        expectedContentCount,
        assignmentAvailable,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data from server.');
    }
  };

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
      <Typography variant="h5" fontWeight="bold" mb={3} sx={{ color: theme.palette.text.primary }}>
        Behavioral Analysis
      </Typography>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      {/* Filters */}
      <Box display="flex" justifyContent="space-between" width="100%" maxWidth="900px" mb={3}>
        {/* Subject Dropdown */}
        <FormControl sx={{ mr: 2, width: '300px', backgroundColor: theme.palette.background.paper, borderRadius: '8px' }}>
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

        {/* Grade Dropdown (filtered based on subject) */}
        <FormControl sx={{ width: '300px', backgroundColor: theme.palette.background.paper, borderRadius: '8px' }}>
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

      {/* Input Fields */}
      <Box display="flex" justifyContent="space-between" width="100%" maxWidth="900px" mb={3}>
        {/* Expected Content Count Input */}
        <TextField
          label="Expected Content Count for Next Week"
          value={expectedContentCount}
          onChange={handleExpectedContentCountChange}
          sx={{ mr: 2, width: '300px', backgroundColor: theme.palette.background.paper, borderRadius: '8px' }}
          InputLabelProps={{ sx: { color: theme.palette.text.secondary } }}
          InputProps={{ sx: { color: theme.palette.text.primary } }}
        />

        {/* Assignment Available Dropdown */}
        <FormControl sx={{ width: '300px', backgroundColor: theme.palette.background.paper, borderRadius: '8px' }}>
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
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!subject || !grade || !expectedContentCount || !assignmentAvailable}
        sx={{
          mb: 3,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Submit
      </Button>

      {/* Metrics */}
      <Box display="flex" justifyContent="space-between" width="100%" maxWidth="900px" mb={3}>
        {/* Avg. Daily Active Time */}
        <Card sx={{ flex: 1, mr: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <AccessTimeIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Avg. Daily Active Time</Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {avgActiveTime} mins
            </Typography>
          </CardContent>
        </Card>

        {/* Time Spent on Resources */}
        <Card sx={{ flex: 1, mr: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <AccessTimeIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Time Spent on Resources</Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {avgTimeSpent}
            </Typography>
          </CardContent>
        </Card>

        {/* Frequency of Resource Access */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <InsertChartIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Frequency of Resource Access</Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {avgAccessFrequency}/day
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Engagement Trends Chart */}
      <Box width="100%" maxWidth="900px">
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Engagement Trends
        </Typography>
        <LineChart
          width={900}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="engagement" stroke="#8884d8" />
          <Line type="monotone" dataKey="frequency" stroke="#82ca9d" />
        </LineChart>
      </Box>
    </Box>
  );
};

export default BehavioralAnalysis;