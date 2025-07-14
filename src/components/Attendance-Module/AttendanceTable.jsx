import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, TableSortLabel, Box
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { MenuItem, FormControl, Select } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';

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
    const isExtraSmallPaper = panelSize < 450;
    const isSmallPaper = panelSize < 650;
    const isMediumPaper = panelSize < 840;

    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [existingAttendanceId, setExistingAttendanceId] = useState(null);

    const isSmallScreen = useMediaQuery('(max-width:768px)');

    const handleSubmit = async () => {
        setLoading(true);
        if (!existingAttendanceId) {
            const success = await markAttendance(classId, attendanceType === "academic" ? "academic" : subjectId, students, selectedDate);
            if (success) await fetchData();
        } else {
            const success = await updateAttendance(existingAttendanceId, classId, attendanceType === "academic" ? "academic" : subjectId, students, selectedDate);
            if (success) await fetchData();
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        const success = await deleteAttendance(existingAttendanceId, classId);
        if (success) await fetchData();
        setLoading(false);
    };

    const handleSearch = (e) => setSearchQuery(e.target.value);

    useEffect(() => {
        const filtered = students.filter(student =>
            student.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [students, searchQuery]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const responseData = await requestData(classId, subjectType, subjectId, selectedDate, mode);
            setStudents(responseData.fetchedData);
            setFilteredData(responseData.fetchedData);
            setExistingAttendanceId(responseData._id);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [classId, attendanceType, selectedDate, subjectType, subjectId]);

    const handleToggleAttendance = (id) => {
        const update = (list) => list.map(student =>
            student.id === id
                ? { ...student, attendance: student.attendance === 'present' ? 'absent' : 'present' }
                : student
        );
        setStudents(prev => {
            const updated = update(prev);
            setFilteredData(update(filteredData));
            return updated;
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
            return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });

        setFilteredData(sorted);
    };

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <Paper elevation={0} sx={{ padding: 2, borderRadius: '10px', width: '100%' }}>
                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '300px',
                            width: '100%',
                        }}
                    >
                        <CircularProgress size={40} />
                    </Box>
                ) : (
                    <>
                        {/* Top controls */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: isExtraSmallPaper ? 'column' : 'row',
                            justifyContent: 'space-between',
                            alignItems: isExtraSmallPaper ? 'stretch' : 'center',
                            mb: 2,
                            gap: 2
                        }}>
                            <Box sx={{ position: 'relative', width: isExtraSmallPaper ? '100%' : '300px' }}>
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
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    sx={{
                                        backgroundColor: '#EFF3FF',
                                        borderRadius: '5px',
                                        border: '1px solid #D9D9D9',
                                        height: '33px',
                                        width: '100%',
                                        fontSize: '0.9rem',
                                        pl: '45px',
                                    }}
                                />
                            </Box>

                            <FormControl sx={{ width: isExtraSmallPaper ? '100%' : '180px' }}>
                                <Select
                                    value={sortConfig.key === 'id' ? sortConfig.direction : ''}
                                    onChange={(e) => handleSort('id', e.target.value)}
                                    displayEmpty
                                    sx={{
                                        backgroundColor: '#EFF3FF',
                                        borderRadius: '5px',
                                        height: 33,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    <MenuItem value="asc">Sort Ascending</MenuItem>
                                    <MenuItem value="desc">Sort Descending</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Table */}
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', overflow: 'auto' }}>
                            <Table sx={{ minWidth: 400 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#00CADC', height: 30 }}>
                                        <TableCell sx={{ color: '#000', fontSize: isExtraSmallPaper ? '0.75rem' : '0.85rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                            <TableSortLabel
                                                active={sortConfig.key === 'id'}
                                                direction={sortConfig.direction}
                                                onClick={() => handleSort('id')}
                                            >
                                                Student ID
                                            </TableSortLabel>
                                        </TableCell>
                                        {!isMediumPaper && (
                                            <TableCell sx={{ color: '#000', fontSize: isExtraSmallPaper ? '0.75rem' : '0.85rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                <TableSortLabel
                                                    active={sortConfig.key === 'name'}
                                                    direction={sortConfig.direction}
                                                    onClick={() => handleSort('name')}
                                                >
                                                    Student Name
                                                </TableSortLabel>
                                            </TableCell>
                                        )}
                                        <TableCell sx={{ color: '#000', fontSize: isExtraSmallPaper ? '0.75rem' : '0.85rem', textAlign: 'center', whiteSpace: 'nowrap' }}>Attendance</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.map((student) => (
                                        <TableRow
                                            key={student.id}
                                            sx={{ backgroundColor: student.attendance === 'present' ? '#49C3FB' : '#BB109D', height: 30, py: 0.5, px: 1 }}
                                        >
                                            <TableCell sx={{ color: student.attendance === 'present' ? '#000' : '#fff' , py: 0.5, px: 1, fontSize: isExtraSmallPaper ? '0.75rem' : '0.85rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                {student.id}
                                            </TableCell>
                                            {!isMediumPaper && (
                                                <TableCell sx={{ color: student.attendance === 'present' ? '#000' : '#fff', py: 0.5, px: 1, fontSize: isExtraSmallPaper ? '0.75rem' : '0.85rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                    {student.name}
                                                </TableCell>
                                            )}
                                            <TableCell sx={{ textAlign: 'center', color: student.attendance === 'present' ? '#000' : '#fff', py: 0.5, px: 1 }}>
                                                {mode === 'edit' ? (
                                                    <Button
                                                        onClick={() => handleToggleAttendance(student.id)}
                                                        sx={{
                                                            color: student.attendance === 'present' ? '#000' : '#fff',
                                                            fontSize: '0.8rem',
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        {student.attendance}
                                                    </Button>
                                                ) : (
                                                    student.attendance
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredData.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">
                                                No students found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Action buttons */}
                        {mode === 'edit' && (
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                                {existingAttendanceId && (
                                    <Button
                                        variant="contained"
                                        onClick={handleDelete}
                                        disabled={loading}
                                        sx={{ backgroundColor: '#3674B5', width: '120px' }}
                                    >
                                        {loading ? 'Deleting...' : 'Delete'}
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    sx={{ backgroundColor: '#3674B5', width: '120px' }}
                                >
                                    {loading ? 'Submitting...' : 'Submit'}
                                </Button>
                            </Box>
                        )}
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default AttendanceTable;