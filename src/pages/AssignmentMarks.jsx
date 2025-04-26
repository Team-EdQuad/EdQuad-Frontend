import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from '@mui/material';

import React from 'react';


import { Box, Typography } from '@mui/material';

const subjects = [
  { name: 'Sinhala', assignname: 'assignment 1', marks: 75 },
  { name: 'English', assignname: 'grammer', marks: 89 },
  { name: 'Science', assignname: 'plants', marks: 74 },
  { name: 'Maths', assignname: 'calculas', marks: 90 },
];

const MySubject = () => {
  const theme = useTheme(); // Access the current theme

  return (
    <Box>
      {/* Main Content Area */}
      <Box display="flex">
        {/* Sidebar */}

        {/* Page Content */}
        <Box flex={1} p={2}>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Assignment Marks
          </Typography>

          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: theme.palette.background.paper, // Dynamic background
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.primary.main, // Dynamic header background
                      color: theme.palette.primary.contrastText, // Dynamic header text color
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
                {subjects.map((subject, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        index % 2 === 0
                          ? theme.palette.action.hover // Alternate row color
                          : theme.palette.background.default,
                    }}
                  >
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.assignname}</TableCell>
                    <TableCell>{subject.marks}</TableCell>
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