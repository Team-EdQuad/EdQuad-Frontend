import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Paper, useTheme } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const CheckAssignment = () => {
  const theme = useTheme(); // Access the current theme
  const [marks, setMarks] = useState({}); // State to store marks for each student

  const assignments = [
    { student: 'Student 1', assignmentName: 'Assignment 1', file: 'Assignment1.pdf' },
    { student: 'Student 2', assignmentName: 'Assignment 1', file: 'Assignment1.pdf' },
    { student: 'Student 3', assignmentName: 'Assignment 2', file: 'Assignment2.pdf' },
    { student: 'Student 2', assignmentName: 'Assignment 3', file: 'Assignment3.pdf' },
  ];

  const handleMarkChange = (index, value) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [index]: value,
    }));
  };

  const handleSubmit = (index) => {
    console.log(`Marks for ${assignments[index].student}:`, marks[index]);
    // Add logic to save marks
  };

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
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        sx={{
          color: theme.palette.text.primary, // Dynamic text color
        }}
      >
        Check Assignments
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: theme.palette.background.paper, // Dynamic table background
          borderRadius: '8px',
          boxShadow: 1,
          maxWidth: '900px',
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
                Name of Student
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
                Uploaded Files
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
              <TableCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 'bold',
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? theme.palette.action.hover : theme.palette.background.default, // Alternate row colors
                }}
              >
                <TableCell>{assignment.student}</TableCell>
                <TableCell>{assignment.assignmentName}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.primary.main, // Dynamic link color
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                      onClick={() => {
                        // Logic to download or view the file
                        console.log(`Downloading ${assignment.file}`);
                      }}
                    >
                      {assignment.file}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={marks[index] || ''}
                    onChange={(e) => handleMarkChange(index, e.target.value)}
                    sx={{
                      width: '80px',
                      backgroundColor: theme.palette.background.paper, // Dynamic input background
                      color: theme.palette.text.primary, // Dynamic text color
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleSubmit(index)}
                    sx={{
                      backgroundColor: theme.palette.primary.main, // Dynamic button background
                      color: theme.palette.primary.contrastText, // Dynamic button text color
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark, // Dynamic hover background
                      },
                    }}
                  >
                    Submit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CheckAssignment;