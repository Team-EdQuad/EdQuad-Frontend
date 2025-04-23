import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
  } from '@mui/material';

import React from 'react';
import { Box, Typography } from '@mui/material';


const subjects = [
    { name: 'Sinhala', term1: 75, term2: 75, term3: 75 },
    { name: 'English', term1: 89, term2: 89, term3: 89 },
    { name: 'Science', term1: 74, term2: 74, term3: 74 },
    { name: 'Maths', term1: 90, term2: 90, term3: 90 },
  ];
  
  const term1Total = subjects.reduce((sum, s) => sum + s.term1, 0);
  const term2Total = subjects.reduce((sum, s) => sum + s.term2, 0);
  const term3Total = subjects.reduce((sum, s) => sum + s.term3, 0);
  
  const term1Avg = term1Total / subjects.length;
  const term2Avg = term2Total / subjects.length;
  const term3Avg = term3Total / subjects.length;
  



const MySubject = () => {
  return (
    <Box>
    
      {/* Main Content Area */}
      <Box display="flex">
        

        {/* Page Content */}
        <Box flex={1} p={2}>
  <Typography variant="h4" fontWeight="bold" mb={2}>
    Term Test Marks
  </Typography>

  <TableContainer component={Paper} sx={{ backgroundColor: '#f0f6ff' }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ backgroundColor: '#8eeeff', fontWeight: 'bold' }}>Subject</TableCell>
          <TableCell sx={{ backgroundColor: '#8eeeff', fontWeight: 'bold' }}>1st Term</TableCell>
          <TableCell sx={{ backgroundColor: '#8eeeff', fontWeight: 'bold' }}>2nd Term</TableCell>
          <TableCell sx={{ backgroundColor: '#8eeeff', fontWeight: 'bold' }}>3rd Term</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {subjects.map((subject, index) => (
          <TableRow key={index}>
            <TableCell>{subject.name}</TableCell>
            <TableCell>{subject.term1}</TableCell>
            <TableCell>{subject.term2}</TableCell>
            <TableCell>{subject.term3}</TableCell>
          </TableRow>
        ))}

        {/* Total Row */}
        <TableRow>
          <TableCell sx={{ backgroundColor: '#b7fbe3', fontWeight: 'bold' }}>Total</TableCell>
          <TableCell sx={{ backgroundColor: '#dcfef2' }}>{term1Total}</TableCell>
          <TableCell sx={{ backgroundColor: '#dcfef2' }}>{term2Total}</TableCell>
          <TableCell sx={{ backgroundColor: '#dcfef2' }}>{term3Total}</TableCell>
        </TableRow>

        {/* Average Row */}
        <TableRow>
          <TableCell sx={{ backgroundColor: '#b7fbe3', fontWeight: 'bold' }}>Average</TableCell>
          <TableCell sx={{ backgroundColor: '#dcfef2' }}>{term1Avg.toFixed(2)}</TableCell>
          <TableCell sx={{ backgroundColor: '#dcfef2' }}>{term2Avg.toFixed(2)}</TableCell>
          <TableCell sx={{ backgroundColor: '#dcfef2' }}>{term3Avg.toFixed(2)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
</Box>

       


      </Box>

    </Box>
  );
};

export default MySubject;