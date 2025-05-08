import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Box,
  Typography,
} from '@mui/material';

const MySubject = () => {
  const theme = useTheme();
  const [assignments, setAssignments] = useState([]);
  const studentId = "STU001";

  useEffect(() => {
    const fetchAssignmentMarks = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/assignmentmarks/${studentId}`);
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignment marks:', error);
      }
    };

    fetchAssignmentMarks();
  }, []);

  return (
    <Box>
      <Box display="flex">
        <Box flex={1} p={2}>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Assignment Marks
          </Typography>

          <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.paper }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 'bold',
                    }}
                  >
                    Subject
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 'bold',
                    }}
                  >
                    Assignment Name
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      fontWeight: 'bold',
                    }}
                  >
                    Marks
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        index % 2 === 0
                          ? theme.palette.action.hover
                          : theme.palette.background.default,
                    }}
                  >
                    <TableCell>{item.subject_name}</TableCell>
                    <TableCell>{item.assignment_name || 'N/A'}</TableCell>
                    <TableCell>{item.marks !== null ? item.marks : 'Pending'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default MySubject;
