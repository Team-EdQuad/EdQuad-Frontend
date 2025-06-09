import React, { useState, useEffect,useContext } from 'react';
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
import { LineChart } from '@mui/x-charts/LineChart';
import { StoreContext } from '../context/StoreContext';


const BehavioralAnalysis = () => {
  const theme = useTheme();  
  const { id: teacher_id } = useContext(StoreContext);
  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  
  // State declarations
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
  const [chartLoading, setChartLoading] = useState(false);
  const [weekRange, setWeekRange] = useState(12);
  const [chartData, setChartData] = useState({
    xAxisData: [],
    series: [],
  });
  const [predictedData, setPredictedData] = useState(null);

  // Fetch subjects and grades on component mount
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

  // Log chartData changes for debugging
  useEffect(() => {
    console.log('chartData updated:', chartData);
    console.log('predictedData updated:', predictedData);
  }, [chartData, predictedData]);

  // Re-fetch or reprocess chart data when weekRange, subject, or grade changes
  useEffect(() => {
    if (subject && grade) {
      const selectedSubject = subjectsGrades.find((item) => item.subject_name === subject);
      const selectedGrade = selectedSubject?.classes.find((cls) => cls.class_name === grade);
      const subject_id = selectedSubject?.subject_id;
      const class_id = selectedGrade?.class_id;

      if (subject_id && class_id) {
        console.log('weekRange changed, re-fetching data for:', { subject_id, class_id, weekRange });
        fetchVisualizationData(subject_id, class_id);
      }
    }
  }, [weekRange, subject, grade, subjectsGrades]);

  // Event handlers
  const handleSubjectChange = (event) => {
    const selectedSubject = event.target.value;
    setSubject(selectedSubject);
    setGrade('');
    setAssignmentAvailable('');
    setError('');
    const selected = subjectsGrades.find((item) => item.subject_name === selectedSubject);
    setFilteredGrades(selected ? selected.classes : []);
  };

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
    setError('');
  };

  const handleExpectedContentCountChange = (event) => {
    setExpectedContentCount(event.target.value);
    setError('');
  };

  const handleAssignmentAvailableChange = (event) => {
    setAssignmentAvailable(event.target.value);
    setError('');
  };

  const handleWeekRangeChange = (event) => {
    const newWeekRange = Number(event.target.value);
    setWeekRange(newWeekRange);
    console.log('Week range changed to:', newWeekRange);
  };

  // Fetch visualization data for chart
  const fetchVisualizationData = async (subject_id, class_id) => {
    try {
      setChartLoading(true);
      const url = `${API_BASE_URL}/visualize_data/${subject_id}/${class_id}`;
      console.log('Fetching data from:', url);
      const response = await axios.get(url);
      console.log('API Response:', response.data);

      if (response.data && Array.isArray(response.data.x) && Array.isArray(response.data.y)) {
        let xData = response.data.x.map(Number);
        let yData = response.data.y.map(Number);
        console.log('xData before slicing:', xData);
        console.log('yData before slicing:', yData);

        const maxWeeks = weekRange;
        if (xData.length > maxWeeks) {
          xData = xData.slice(-maxWeeks);
          yData = yData.slice(-maxWeeks);
        }
        console.log('Sliced xData:', xData);
        console.log('Sliced yData:', yData);

        if (xData.length === yData.length && xData.length > 0) {
          // Prepare historical series
          const historicalSeries = {
            data: yData,
            label: 'Historical Active Time (mins)',
            color: theme.palette.primary.main,
          };

          // Prepare predicted series if predictedData exists
          let series = [historicalSeries];
          let finalXData = [...xData];

          if (predictedData) {
            const nextWeek = xData[xData.length - 1] + 1;
            finalXData = [...xData, nextWeek];
            
            // Create segments for different styling
            const historicalSegment = {
              data: [...yData, null],
              label: 'Historical Active Time (mins)',
              color: theme.palette.primary.main,
            };
            
            const predictionSegment = {
              data: [
                ...Array(xData.length - 1).fill(null),
                yData[yData.length - 1],
                predictedData.predicted_active_time
              ],
              label: 'Predicted Active Time (mins)',
              color: '#d32f2f',
              strokeDasharray: '8 4',
              showMark: true,
            };
            
            series = [historicalSegment, predictionSegment];
          }

          const newChartData = {
            xAxisData: finalXData,
            series,
          };
          console.log('Setting chartData:', newChartData);
          setChartData(newChartData);
        } else {
          console.log('Data length mismatch or empty');
          setChartData({ xAxisData: [], series: [] });
        }
      } else {
        console.log('Invalid API response structure');
        setChartData({ xAxisData: [], series: [] });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setChartData({ xAxisData: [], series: [] });
      setError('Failed to fetch visualization data. Please try again.');
    } finally {
      setChartLoading(false);
    }
  };

  // Handle form submission with fixed form data for predict_active_time
  const handleSubmit = async () => {
    const selectedSubject = subjectsGrades.find((item) => item.subject_name === subject);
    const selectedGrade = selectedSubject?.classes.find((cls) => cls.class_name === grade);
    const subject_id = selectedSubject?.subject_id;
    const class_id = selectedGrade?.class_id;

    console.log('Selected subject_id:', subject_id, 'class_id:', class_id);

    if (!subject_id || !class_id) {
      setError('Invalid subject or grade selection.');
      return;
    }

    if (!expectedContentCount || !assignmentAvailable) {
      setError('Please provide Expected Content Count and Assignment Available.');
      return;
    }

    // Validate expectedContentCount is a positive number
    const contentCount = Number(expectedContentCount);
    if (isNaN(contentCount) || contentCount <= 0) {
      setError('Expected Content Count must be a valid positive number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch GET requests first
      const [timeSpentResponse, activeTimeResponse, accessFrequencyResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/TimeSpendOnResources/${subject_id}/${class_id}`),
        axios.get(`${API_BASE_URL}/SiteAverageActiveTime/${class_id}`),
        axios.get(`${API_BASE_URL}/ResourceAccessFrequency/${subject_id}/${class_id}`)
      ]);

      // Prepare form data for predict_active_time POST request
      const params = new URLSearchParams();
      params.append('Weeknumber', '121');
      params.append('SpecialEventThisWeek', assignmentAvailable === 'Yes' ? '1' : '0');
      params.append('ResourcesUploadedThisWeek', contentCount.toString());

      console.log('Sending predict request with form data:', {
        Weeknumber: 121,
        SpecialEventThisWeek: assignmentAvailable === 'Yes' ? 1 : 0,
        ResourcesUploadedThisWeek: contentCount
      });

      // Make the POST request with form data
      const predictResponse = await axios.post(
        `${API_BASE_URL}/predict_active_time/`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      // Process all responses
      setAvgTimeSpent(timeSpentResponse.data.avgTimeSpentPerStudent || 0);
      setAvgActiveTime(activeTimeResponse.data.siteAverageActiveTimePerStudent || 0);
      setAvgAccessFrequency(accessFrequencyResponse.data.avgAccessPerStudentInClass || 0);
      setPredictedData(predictResponse.data);
      console.log('Predicted Active Time:', predictResponse.data);

      // Fetch historical data for chart
      await fetchVisualizationData(subject_id, class_id);
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 422) {
        setError(`Validation Error: ${JSON.stringify(error.response.data.detail || 'Invalid input data')}`);
      } else {
        setError('Failed to fetch data or predict active time. Please try again.');
      }
      setPredictedData(null);
    } finally {
      setLoading(false);
    }
  };


  // Initial loading state
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
          <FormControl sx={{ minWidth: '200px', flex: 1 }}>
            <InputLabel sx={{ color: theme.palette.text.secondary }}>Select Subject</InputLabel>
            <Select value={subject} onChange={handleSubjectChange} sx={{ color: theme.palette.text.primary }}>
              {subjectsGrades.map((sub) => (
                <MenuItem key={sub.subject_id} value={sub.subject_name}>
                  {sub.subject_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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

          <FormControl sx={{ minWidth: '200px', flex: 1 }}>
            <InputLabel sx={{ color: theme.palette.text.secondary }}>Weeks to Display</InputLabel>
            <Select value={weekRange} onChange={handleWeekRangeChange} sx={{ color: theme.palette.text.primary }}>
              <MenuItem value={4}>Last 4 weeks (1 month)</MenuItem>
              <MenuItem value={8}>Last 8 weeks (2 months)</MenuItem>
              <MenuItem value={12}>Last 12 weeks (3 months)</MenuItem>
              <MenuItem value={24}>Last 24 weeks (6 months)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          <TextField
            label="Expected Content Count for Next Week"
            type="number"
            value={expectedContentCount}
            onChange={handleExpectedContentCountChange}
            sx={{ minWidth: '200px', flex: 1 }}
            InputLabelProps={{ sx: { color: theme.palette.text.secondary } }}
            InputProps={{ sx: { color: theme.palette.text.primary } }}
          />

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

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!subject || !grade || !expectedContentCount || !assignmentAvailable || loading}
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': { backgroundColor: theme.palette.primary.dark },
              '&:disabled': { backgroundColor: theme.palette.action.disabled },
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <TrendingUpIcon />}
          >
            {loading ? 'Analyzing...' : 'Analyze Behavior'}
          </Button>

         
        </Box>
      </Card>

      {/* Metrics Cards */}
      <Box display="flex" flexWrap="wrap" gap={2} width="100%" maxWidth="900px" mb={4}>
        <Card sx={{ flex: 1, minWidth: '250px' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <AccessTimeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="subtitle1" fontWeight="bold">Avg. Daily Active Time</Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color={theme.palette.primary.main}>
              {avgActiveTime} <span style={{ fontSize: '1rem' }}>mins</span>
            </Typography>
            <Typography variant="body2" color={theme.palette.text.secondary} mt={1}>
              Time students spend actively on the platform
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: '250px' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <AccessTimeIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
              <Typography variant="subtitle1" fontWeight="bold">Time Spent on Resources</Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color={theme.palette.secondary.main}>
              {avgTimeSpent} <span style={{ fontSize: '1rem' }}>mins</span>
            </Typography>
            <Typography variant="body2" color={theme.palette.text.secondary} mt={1}>
              Average time per student on learning materials
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: '250px' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <InsertChartIcon sx={{ mr: 1, color: theme.palette.success.main }} />
              <Typography variant="subtitle1" fontWeight="bold">Resource Access Frequency</Typography>
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

      {/* Line Chart */}
      <Card sx={{ width: '100%', maxWidth: '900px', p: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: theme.palette.text.primary }}>
          📈 Weekly Active Time Trends
          {chartData.xAxisData.length > 0 && (
            <Typography component="span" color="text.secondary">
              {' '}
              (Last {chartData.xAxisData.length - (predictedData ? 1 : 0)} weeks
              {predictedData && ', including predicted week'}:{' '}
              {Math.min(...chartData.xAxisData)} - {Math.max(...chartData.xAxisData)})
            </Typography>
          )}
        </Typography>

        <Box sx={{ mb: 2, p: 1, backgroundColor: theme.palette.grey[100], borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Debug Info: X-axis length: {chartData.xAxisData.length || 0}, Series length: {chartData.series.length || 0}
          </Typography>
          {chartData.xAxisData.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Week range: {Math.min(...chartData.xAxisData)} - {Math.max(...chartData.xAxisData)}
              {predictedData && `, Predicted for Week 121: ${predictedData.predicted_active_time.toFixed(2)} mins`}
            </Typography>
          )}
        </Box>

        {chartLoading ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height={400}
            sx={{ backgroundColor: theme.palette.grey[100], borderRadius: 1 }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">Loading chart data...</Typography>
          </Box>
        ) : chartData.xAxisData.length > 0 && chartData.series.length > 0 ? (
          <Box sx={{ width: '100%', height: 400 }}>
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
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height={400}
            sx={{ backgroundColor: theme.palette.grey[100], borderRadius: 1 }}
          >
            <Typography variant="body1" color={theme.palette.text.secondary} sx={{ mb: 1 }}>
              {chartData.xAxisData.length === 0
                ? 'No data available for the selected subject and class'
                : 'Select subject and grade to view active time trends'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Current chart state: {JSON.stringify({
                xAxisLength: chartData.xAxisData.length || 0,
                seriesLength: chartData.series.length || 0,
              })}
            </Typography>
          </Box>
        )}
      </Card>

      {/* Insights Section */}
      {(avgActiveTime || avgTimeSpent || avgAccessFrequency) && (
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
            {predictedData && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Predicted active time for next week (Week 121): {predictedData.predicted_active_time.toFixed(2)} minutes.
                {predictedData.predicted_active_time < 200
                  ? ' Consider increasing content or engagement strategies.'
                  : ' This suggests continued strong engagement.'}
              </Alert>
            )}
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default BehavioralAnalysis;
