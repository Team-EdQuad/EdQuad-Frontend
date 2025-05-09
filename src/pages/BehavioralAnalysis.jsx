import React, { useState } from 'react';
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
  useTheme,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const BehavioralAnalysis = () => {
  const theme = useTheme(); // Access the current theme
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [viewType, setViewType] = useState('daily');

  const data = [
    { name: 'Mon', engagement: 45, frequency: 15 },
    { name: 'Tue', engagement: 50, frequency: 18 },
    { name: 'Wed', engagement: 60, frequency: 20 },
    { name: 'Thu', engagement: 40, frequency: 12 },
    { name: 'Fri', engagement: 50, frequency: 15 },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor={theme.palette.background.default} // Dynamic background color
      minHeight="100vh"
      p={3}
    >
      {/* Filters */}
      <Box display="flex" justifyContent="space-between" width="100%" maxWidth="900px" mb={3}>
        {/* Select Subject */}
        <FormControl fullWidth sx={{ mr: 2 }}>
          <InputLabel>Select Subject</InputLabel>
          <Select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            label="Select Subject"
          >
            <MenuItem value="Math">Math</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="English">English</MenuItem>
          </Select>
        </FormControl>

        {/* Select Grade */}
        <FormControl fullWidth>
          <InputLabel>Select Grade</InputLabel>
          <Select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            label="Select Grade"
          >
            <MenuItem value="Grade 1">Grade 1</MenuItem>
            <MenuItem value="Grade 2">Grade 2</MenuItem>
            <MenuItem value="Grade 3">Grade 3</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* View Type Buttons */}
      <Box display="flex" justifyContent="center" mb={3}>
        {['daily', 'weekly', 'monthly'].map((type) => (
          <Button
            key={type}
            variant={viewType === type ? 'contained' : 'outlined'}
            onClick={() => setViewType(type)}
            sx={{ mx: 1 }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </Box>

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
              52 mins
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
              43
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
              15/day
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
          data={data}
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