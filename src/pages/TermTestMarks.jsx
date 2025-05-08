import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, Typography, useTheme, MenuItem, Select, FormControl, InputLabel,
} from '@mui/material';
import axios from 'axios';

const TermTestMarks = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    // Fetch marks from the backend
    axios.get('http://127.0.0.1:8000/api/exammarks/STU001')
      .then((res) => {
        setData(res.data);
        const years = [...new Set(res.data.map(entry => entry.exam_year))];
        setAvailableYears(years);
        if (years.length > 0) setSelectedYear(years[0]); // default selection
      })
      .catch(err => console.error('Failed to fetch data:', err));
  }, []);

  // Group data by subject and terms for the selected year
  const subjectMap = {};
  data
    .filter(item => item.exam_year === selectedYear)
    .forEach(item => {
      if (!subjectMap[item.subject_name]) {
        subjectMap[item.subject_name] = {};
      }
      subjectMap[item.subject_name][`term${item.term}`] = item.marks;
    });

  const subjects = Object.entries(subjectMap).map(([name, terms]) => ({
    name,
    term1: terms.term1 || '-',
    term2: terms.term2 || '-',
    term3: terms.term3 || '-',
  }));

  const term1Total = subjects.reduce((sum, s) => sum + (s.term1 !== '-' ? s.term1 : 0), 0);
  const term2Total = subjects.reduce((sum, s) => sum + (s.term2 !== '-' ? s.term2 : 0), 0);
  const term3Total = subjects.reduce((sum, s) => sum + (s.term3 !== '-' ? s.term3 : 0), 0);

  const subjectCount = subjects.length;


  
const term1Avg = subjectCount > 0 ? term1Total / subjectCount : 0;
const term2Avg = subjectCount > 0 ? term2Total / subjectCount : 0;
const term3Avg = subjectCount > 0 ? term3Total / subjectCount : 0;

  return (
    <Box>
      <Box flex={1} p={2}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Term Test Marks
        </Typography>

        <FormControl sx={{ mb: 2, minWidth: 200 }}>
          <InputLabel>Select Year</InputLabel>
          <Select
            value={selectedYear}
            label="Select Year"
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {availableYears.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.paper }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Subject', '1st Term', '2nd Term', '3rd Term'].map((label, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark'
                        ? theme.palette.primary.dark
                        : theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 'bold',
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects.map((subject, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0
                      ? theme.palette.action.hover
                      : theme.palette.background.default,
                  }}
                >
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.term1}</TableCell>
                  <TableCell>{subject.term2}</TableCell>
                  <TableCell>{subject.term3}</TableCell>
                </TableRow>
              ))}

              {/* Total Row */}
              <TableRow>
                <TableCell sx={{ backgroundColor: theme.palette.success.light, fontWeight: 'bold' }}>
                  Total
                </TableCell>
                <TableCell sx={{ backgroundColor: theme.palette.success.lighter }}>
                  {term1Total}
                </TableCell>
                <TableCell sx={{ backgroundColor: theme.palette.success.lighter }}>
                  {term2Total}
                </TableCell>
                <TableCell sx={{ backgroundColor: theme.palette.success.lighter }}>
                  {term3Total}
                </TableCell>
              </TableRow>
{/* Average Row */}
<TableRow>
  <TableCell
    sx={{
      backgroundColor: theme.palette.info.light,
      fontWeight: 'bold',
    }}
  >
    Average
  </TableCell>
  <TableCell
    sx={{
      backgroundColor: theme.palette.info.lighter,
    }}
  >
    {term1Avg.toFixed(2)}
  </TableCell>
  <TableCell
    sx={{
      backgroundColor: theme.palette.info.lighter,
    }}
  >
    {term2Avg.toFixed(2)}
  </TableCell>
  <TableCell
    sx={{
      backgroundColor: theme.palette.info.lighter,
    }}
  >
    {term3Avg.toFixed(2)}
  </TableCell>
</TableRow>



            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default TermTestMarks;
