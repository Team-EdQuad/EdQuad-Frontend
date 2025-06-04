import React, { useState } from "react";
import { Box, Typography, Paper, Checkbox, TextField, Divider, InputAdornment, } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { PieChart, Pie, Cell } from 'recharts';
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const taskData = [
    { name: 'Total Task Completed', value: 92, color: '#00C9FF' },
    { name: 'Tasks Ontime', value: 75, color: '#FF69B4' },
    { name: 'Task Late', value: 68, color: '#FFA500' }
];

const handleCheck = (day, index) => {
    const updated = [...checkedTasks[day]];
    updated[index] = !updated[index];
    setCheckedTasks({ ...checkedTasks, [day]: updated });
};

const assignments = {
    yesterday: ["Assignment 1", "Assignment 2", "Assignment 3"],
    today: ["Assignment 4", "Assignment 5", "Assignment 6"],
    tomorrow: ["Assignment 7", "Assignment 8", "Assignment 9"],
};

const events = [
    'Event 1',
    'Event 2',
    'Sport event',
    'Sport event'
];

const StudentCalendar = () => {
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



                    {/* Events and Complete Tasks */}
                    <Box display="flex" justifyContent="center" mt={4} gap={4}>
                        {/* Events */}
                        <Box>
                            <Paper elevation={2} sx={{ p: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Events
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {["Event 1", "Event 2", "Sport event", "Sport event"].map(
                                    (event, index) => (
                                        <Box
                                            display="flex"
                                            flexDirection="row"
                                            justifyContent="space-between"
                                            gap={10}
                                            key={index}
                                            sx={{
                                                backgroundColor: "#e0e0e0",
                                                p: 1,
                                                mb: 1,
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Typography variant="body2">21/02/2025</Typography>
                                            <Typography variant="body1">{event}</Typography>
                                        </Box>
                                    )
                                )}

                            </Paper>
                        </Box>
                        <Box>
                            <Paper elevation={2} sx={{ p: 2 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Complete Tasks
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {taskData.map((item, i) => (
                                    <Box
                                        key={i}
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        mb={2}
                                        gap={10}
                                    >
                                        <PieChart width={40} height={40}>
                                            <Pie
                                                data={[{ value: item.value }, { value: 100 - item.value }]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={10}
                                                outerRadius={20}
                                                startAngle={90}
                                                endAngle={-270}
                                                dataKey="value"
                                            >
                                                <Cell fill={item.color} />
                                                <Cell fill="#f0f0f0" />
                                            </Pie>
                                        </PieChart>
                                        <Box ml={1} mb={0.75}>
                                            <Typography fontWeight="bold">{item.value}%</Typography>
                                            <Typography variant="body2">{item.name}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Paper>

                        </Box>
                    </Box>
                </Box>

                                {/* To Do List */}
                <Box minWidth="300px">
                    <Typography variant="h6" fontWeight="bold" mb={2}>To Do -</Typography>
                    {Object.entries(assignments).map(([day, tasks]) => (
                        <Box key={day} mb={3}>
                            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                            </Typography>
                            {tasks.map((task, idx) => (
                                <Box key={`${day}-${idx}`} mb={1}>
                                    <TextField
                                        size="small"
                                        value={task}
                                        onChange={(e) => handleTextChange(day, idx, e.target.value)}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Checkbox
                                                        checked={task.checked}
                                                        onChange={() => handleCheckboxChange(day, idx)}
                                                    />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default StudentCalendar;