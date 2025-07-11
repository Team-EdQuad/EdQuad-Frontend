import React, { useState, useEffect, useRef } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, TableSortLabel, Box,

} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { MenuItem, FormControl, Select } from '@mui/material';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
const attendanceModuleUrl = import.meta.env.VITE_ATTENDANCE_MODULE_BACKEND_URL;




const requestData = async (classId, subject_type, subjectId, date, mode) => {
    const requestData = {
        class_id: classId,
        subject_id: subjectId,
        subject_type: subject_type,   // This will be 'academic', 'sport', or 'club'
        date: date,
        mode: mode
    };

    try {
        // Different endpoints for student and teacher roles
        const endpoint = classId.startsWith('STU') && mode == 'view'   
            ? `${attendanceModuleUrl}/get_student_attendance`
            : `${attendanceModuleUrl}/students/by-class`;

        console.log("Sending request with data:", requestData); // Add logging

        const response = await axios.post(endpoint, requestData);
        const responseData = response.data;
        console.log("Response data:", responseData); // Add logging

        const fetchedData = responseData.data.map((student) => ({
            id: student.student_id,
            name: student.full_name,
            attendance: student.attendance || 'present',
        }));

        return {
            "_id": responseData._id,
            "fetchedData": fetchedData
        };
    } catch (error) {
        console.error('Error fetching student data:', error);
        console.error('Request data was:', requestData); // Add error logging
        return {
            "_id": null,
            "fetchedData": []
        };
    }
};


const markAttendance = async (classId, subjectId, students, date = null) => {
    const status = {};

    // Build the status object
    students.forEach((student) => {
        status[student.id] = student.attendance?.toLowerCase() || "absent";
    });

    // If no date is provided, use today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    const payload = {
        class_id: classId,
        subject_id: subjectId,
        status: status,
        ...(date && { date: date || today }) // include only if date is given
    };

    try {
        const endpoint = classId.startsWith('STU')
            ? `${attendanceModuleUrl}/mark_student_attendance`
            : `${attendanceModuleUrl}/attendance_marking`;

        const response = await axios.post(endpoint, payload);
        console.log('✅ Attendance marked successfully:', response.data);
        return true;

    } catch (error) {
        console.error('Error marking attendance:', error);
        return false;
    }

};


const updateAttendance = async (attendance_id, classId, subjectId, students, date) => {
    const status = {};

    // Build the status object
    students.forEach((student) => {
        status[student.id] = student.attendance?.toLowerCase() || "absent";
    });

    const payload = {
        class_id: classId,
        subject_id: subjectId,
        status: status,
        date: date
    };

    try {
        // Different endpoints for student and teacher roles
        const endpoint = classId.startsWith('STU')
            ? `${attendanceModuleUrl}/update_student_attendance/${attendance_id}`
            : `${attendanceModuleUrl}/update_attendance_of_class/${attendance_id}`;

        const response = await axios.put(endpoint, payload);
        console.log('✅ Attendance updated successfully:', response.data);
        return true;
    } catch (error) {
        console.error('Error updating attendance:', error);
        return false;
    }
};


const deleteAttendance = async (attendance_id, classId) => {
    try {
        // Different endpoints for student and teacher roles
        const endpoint = classId.startsWith('STU')
            ? `${attendanceModuleUrl}/delete-student-attendance/${attendance_id}`
            : `${attendanceModuleUrl}/delete-attendance-of-class/${attendance_id}`;

        const response = await axios.delete(endpoint);
        console.log('✅ Attendance deleted successfully:', response.data);
        return true;
    } catch (error) {
        console.error('Error deleting attendance:', error);
        return false;
    }
};


const AttendanceTable = ({ classId, attendanceType, subjectType, subjectId, selectedDate, mode, panelSize }) => {

    console.log("This is from table: " + panelSize);
    const isExtraSmallPaper = panelSize < 450;
    const isSmallPaper = panelSize < 650;
    const isMediumPaper = panelSize < 840;
    const isLargePaper = panelSize >= 840;


    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [existingAttendanceId, setExistingAttendanceId] = useState(null);

    // Define screen size breakpoints
    // const isExtraSmallPaper = useMediaQuery('(max-width:600px)');
    const isSmallScreen = useMediaQuery('(max-width:768px)');
    const isMediumScreen = useMediaQuery('(max-width:900px)');
    const isLargeScreen = useMediaQuery('(max-width:1200px)');
    const isExtraLargeScreen = useMediaQuery('(max-width:1536px)');

    const handleSubmit = async () => {
        setLoading(true);
        if (!existingAttendanceId) {
            const success = await markAttendance(classId, attendanceType === "academic" ? "academic" : subjectId, students, selectedDate);
            if (success) {
                console.log('Attendance submitted successfully');
                await fetchData();
            } else {
                console.log('Failed to submit attendance');
            }
        } else {
            const success = await updateAttendance(existingAttendanceId, classId, attendanceType === "academic" ? "academic" : subjectId, students, selectedDate);
            if (success) {
                console.log('Attendance Updated successfully');
                await fetchData(); // 🔁 Refresh the student data
            } else {
                console.log('Failed to Update attendance');
            }
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        const success = await deleteAttendance(existingAttendanceId, classId);
        if (success) {
            console.log('Attendance Deleted successfully');
            await fetchData();
        } else {
            console.log('Failed to Delete attendance');
        }
    }


    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        const filtered = students.filter(student =>
            student.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [students, searchQuery]);

    const fetchData = async () => {
        try {
          const responseData = await requestData(classId, subjectType, subjectId, selectedDate, mode);
          
          const fetchedData = responseData.fetchedData;
          setStudents(fetchedData);
          setFilteredData(fetchedData); // Set initial filtered data
          setExistingAttendanceId(responseData._id);
      
          console.log("This is from table:", responseData); // Use comma for better logging
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
    };
      

    useEffect(() => {
        fetchData();
    }, [classId, attendanceType, selectedDate, subjectType, subjectId]);


    const handleToggleAttendance = (id) => {
        console.log('Toggling attendance for student:', id);
        
        // Update both students and filteredData
        const updateAttendanceInList = (list) => list.map(student => {
            if (student.id === id) {
                const newAttendance = student.attendance === 'present' ? 'absent' : 'present';
                console.log('Changing attendance from', student.attendance, 'to', newAttendance);
                return { ...student, attendance: newAttendance };
            }
            return student;
        });

        setStudents(prevStudents => {
            const updatedStudents = updateAttendanceInList(prevStudents);
            setFilteredData(updateAttendanceInList(filteredData));
            return updatedStudents;
        });
    };

    const handleSort = (key, manualDirection = null) => {
        let direction = manualDirection || 'asc';
        if (!manualDirection && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });

        const sorted = [...filteredData].sort((a, b) => {
            const valA = a[key].toString().toLowerCase();
            const valB = b[key].toString().toLowerCase();
            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredData(sorted);
    };


    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        }}>
            <Paper elevation={0} sx={{ 
                padding: 2, 
                borderRadius: '10px', 
                width: '100%',
                overflow: 'hidden'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isExtraSmallPaper ? 'column' : 'row', 
                    justifyContent: 'space-between', 
                    alignItems: isExtraSmallPaper ? 'stretch' : 'center', 
                    mb: 2, 
                    gap: 2
                }}>
                    <Box sx={{ 
                        position: 'relative',
                        width: isExtraSmallPaper ? '100%' : '300px',
                        marginTop: isExtraSmallPaper ? 1 : 0,
                    }}>
                        <SearchIcon sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '33px',
                            width: '33px',
                            backgroundColor: '#D9D9D9',
                            color: '#000',
                            padding: '5px',
                            borderRadius: '5px 0px 0px 5px',
                            zIndex: 1,
                        }} />
                        <InputBase
                            placeholder="Search by ID or Name"
                            inputProps={{ 
                                'aria-label': 'search'
                            }}
                            value={searchQuery}
                            onChange={handleSearch}
                            sx={{
                                backgroundColor: '#EFF3FF',
                                borderRadius: '5px',
                                border: '1px solid #D9D9D9',
                                height: '33px',
                                width: '100%',
                                fontSize: '0.9rem',
                                '& .MuiInputBase-input': {
                                    paddingLeft: '45px',
                                    paddingRight: '8px',
                                    height: '100%',
                                },
                                '&:hover': {
                                    backgroundColor: '#EFF3FF',
                                },
                            }}
                        />
                    </Box>

                    <FormControl sx={{ 
                        width: isExtraSmallPaper ? '100%' : '180px',
                        minWidth: 'auto'
                    }}>
                        <Select
                            value={sortConfig.key === 'id' ? sortConfig.direction : ''}
                            onChange={(e) => handleSort('id', e.target.value)}
                            displayEmpty
                            sx={{
                                backgroundColor: '#EFF3FF',
                                borderRadius: '5px',
                                color: '#333',
                                height: 33,
                                fontSize: '0.9rem',
                                width: '100%',
                                '& .MuiSelect-select': {
                                    paddingLeft: '12px',
                                },
                                '& .MuiSelect-icon': {
                                    backgroundColor: '#D9D9D9',
                                    color: '#000',
                                    width: '33px',
                                    height: '33px',
                                    borderRadius: '0px 5px 5px 0px',
                                    right: 0,
                                    top: 0,
                                    padding: '5px'
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#D9D9D9',
                                    borderWidth: '1px'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#D9D9D9',
                                    borderWidth: '1px'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#D9D9D9',
                                    borderWidth: '1px'
                                }
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: '#EFF3FF',
                                        border: '1px solid #D9D9D9',
                                        borderRadius: '0px 0px 5px 5px',
                                        mt: 0.5,
                                        '& .MuiMenuItem-root': {
                                            fontSize: '0.9rem',
                                            padding: '8px 12px',
                                            '&:hover': {
                                                backgroundColor: '#00CADC20',
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: '#00CADC',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#00CADC',
                                                }
                                            },
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="asc">Sort Ascending</MenuItem>
                            <MenuItem value="desc">Sort Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <TableContainer 
                    component={Paper} 
                    sx={{ 
                        boxShadow: 'none',
                        overflow: 'auto'
                    }}
                >
                    <Table
                        sx={{
                            width: '100%',
                            borderCollapse: 'separate',
                            borderSpacing: '3px 0px',
                            minWidth: isExtraSmallPaper ? 400 : isSmallPaper ? 500 : 600
                        }}
                    >
                        <TableHead
                            sx={{
                                '& .MuiTableCell-head': {
                                    borderBottom: '5px solid #fff',
                                    paddingBottom: '12px',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap'
                                },
                            }}
                        >
                            <TableRow sx={{ backgroundColor: '#00CADC', height: 33 }}>
                                <TableCell sx={{ fontSize: isExtraSmallPaper ? '0.8rem' : '0.9rem' }}>
                                    <TableSortLabel
                                        active={sortConfig.key === 'id'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('id')}
                                    >
                                        Student ID
                                    </TableSortLabel>
                                </TableCell>
                                {!isMediumPaper && (
                                    <TableCell sx={{ fontSize: isExtraSmallPaper ? '0.8rem' : '0.9rem' }}>
                                        <TableSortLabel
                                            active={sortConfig.key === 'name'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('name')}
                                        >
                                            Student Name
                                        </TableSortLabel>
                                    </TableCell>
                                )}
                                <TableCell sx={{ fontSize: isExtraSmallPaper ? '0.8rem' : '0.9rem' }}>
                                    Attendance
                                </TableCell>
                                {/* {!isSmallPaper && (
                                    <TableCell sx={{ fontSize: isExtraSmallPaper ? '0.8rem' : '0.9rem' }}>
                                        Yearly Pres
                                    </TableCell>
                                )} */}
                                {/* {!isExtraSmallPaper && (
                                    <TableCell sx={{ fontSize: isExtraSmallPaper ? '0.8rem' : '0.9rem' }}>
                                        Trend Pres
                                    </TableCell>
                                )} */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((student) => (
                                <TableRow
                                    key={student.id}
                                    sx={{
                                        backgroundColor: student.attendance === 'present' ? '#49C3FB' : '#BB109D',
                                        height: 33,
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            color: student.attendance === 'present' ? '#000' : '#fff',
                                            textAlign: 'center',
                                            fontSize: isExtraSmallPaper ? '0.8rem' : '0.9rem',
                                            py: 1,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {student.id}
                                    </TableCell>
                                    {!isMediumPaper && (
                                        <TableCell
                                            sx={{
                                                color: student.attendance === 'present' ? '#000' : '#fff',
                                                textAlign: 'center',
                                                fontSize: isExtraSmallPaper ? '0.8rem' : '0.9rem',
                                                py: 1,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {student.name}
                                        </TableCell>
                                    )}
                                    <TableCell 
                                        sx={{ 
                                            textAlign: 'center', 
                                            py: 1, 
                                            fontSize: isExtraSmallPaper ? '0.8rem' : '0.9rem',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {mode === 'edit' ? (
                                            <Button
                                                onClick={() => handleToggleAttendance(student.id)}
                                                sx={{
                                                    height: 20,
                                                    minHeight: 20,
                                                    fontSize: '0.8rem',
                                                    px: 2,
                                                    backgroundColor: 'transparent',
                                                    color: student.attendance === 'present' ? '#000' : '#fff',
                                                    boxShadow: 'none',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                                    },
                                                }}
                                            >
                                                {student.attendance}
                                            </Button>
                                        ) : (
                                            student.attendance
                                        )}
                                    </TableCell>
                                    {/* {!isSmallPaper && (
                                        <TableCell
                                            sx={{
                                                color: student.attendance === 'present' ? '#000' : '#fff',
                                                textAlign: 'center',
                                                fontSize: isExtraSmallPaper ? '0.8rem' : '0.9rem',
                                                py: 1,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {student.monthly}
                                        </TableCell>
                                    )} */}
                                    {/* {!isExtraSmallPaper && (
                                        <TableCell
                                            sx={{
                                                color: student.attendance === 'present' ? '#000' : '#fff',
                                                textAlign: 'center',
                                                fontSize: isExtraSmallPaper ? '0.8rem' : '0.9rem',
                                                py: 1,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {student.trend}
                                        </TableCell>
                                    )} */}
                                </TableRow>
                            ))}
                            {filteredData.length === 0 && (
                                <TableRow>
                                    <TableCell 
                                        colSpan={5} 
                                        align="center"
                                        sx={{
                                            fontSize: isExtraSmallPaper ? '0.8rem' : '0.9rem'
                                        }}
                                    >
                                        No students found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {mode === 'edit' && (
                    <Box sx={{ 
                        mt: 2, 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: 2,
                        flexWrap: 'wrap'
                    }}>
                        {existingAttendanceId && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleDelete}
                                disabled={loading}
                                sx={{ 
                                    backgroundColor: '#3674B5', 
                                    borderRadius: '5px', 
                                    width: isExtraSmallPaper ? '100%' : '120px', 
                                    height: '35px', 
                                    boxShadow: 0 
                                }}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{ 
                                backgroundColor: '#3674B5', 
                                borderRadius: '5px', 
                                width: isExtraSmallPaper ? '100%' : '120px', 
                                height: '35px', 
                                boxShadow: 0 
                            }}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default AttendanceTable;
