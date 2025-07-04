import React, { useState } from "react";
import { Box, Typography, Paper, Checkbox, TextField, Divider, InputAdornment, } from '@mui/material';
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";



const handleCheck = (day, index) => {
    const updated = [...checkedTasks[day]];
    updated[index] = !updated[index];
    setCheckedTasks({ ...checkedTasks, [day]: updated });
};

const assignments = ["Assignment 1", "Assignment 2", "Assignment 3","Assignment 4"]


const AdminCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    return (
        <Box sx={{ backgroundColor: '#EEF2FB', p: 4, minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
                Calendar
            </Typography>

            <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={4}>
                {/* Calendar and Tasks Summary */}
                <Box flex={1} minWidth="300px">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            sx={{ backgroundColor: "white", borderRadius: "8px", width: "65%", boxShadow: 3 }}
                        />
                    </LocalizationProvider>
                </Box>

                {/* To Do List */}
                <Box minWidth="300px">
                    <Typography variant="h6" fontWeight="bold" mb={2}>Today's Schedule</Typography>
                    {assignments.map((assignment, index) => (
                        <Box key={index} mb={3}>
                            <Box key={index} mb={1}>
                                <TextField
                                    sx={{
                                        backgroundColor: 'white',
                                        '& .MuiInputBase-root': {
                                            backgroundColor: 'white' 
                                        }
                                    }}
                                    size="small"
                                    value={assignment}
                                    onChange={(e) => handleTextChange(idx, e.target.value)}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Checkbox
                                                    checked={assignment.checked}
                                                    onChange={() => handleCheckboxChange(index)}
                                                />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default AdminCalendar;