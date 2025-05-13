import React, { useState, useContext, useRef, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { format } from 'date-fns';

import { StoreContext } from '../../context/StoreContext';
import { useElementSize } from '../../hooks/useElementSize';

import CustomDropdown from '../../components/Attendance-Module/CustomDropdown';
import DateSelector from '../../components/Attendance-Module/DateSelector';
import AttendanceTable from '../../components/Attendance-Module/AttendanceTable';


const TeacherAttendanceEntry = () => {
    const [panelRef, panelSize] = useElementSize();

    console.log("This is from table: " + panelSize.width);
    const isExtraSmallPaper = panelSize.width < 430;
    const isSmallPaper = panelSize.width < 650;
    const isMediumPaper = panelSize.width < 840;
    const isLargePaper = panelSize.width >= 840;

    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [classId, setClassId] = useState('CLS013');
    const [attendanceType, setAttendanceType] = useState('academic');
    const [subjectType, setSubjectType] = useState('SUB001');

    // Define screen size breakpoints
    const isExtraSmallScreen = useMediaQuery('(max-width:600px)');
    const isSmallScreen = useMediaQuery('(max-width:768px)');
    const isMediumScreen = useMediaQuery('(max-width:900px)');
    const isLargeScreen = useMediaQuery('(max-width:1200px)');
    const isExtraLargeScreen = useMediaQuery('(max-width:1536px)');

    const handleClassIdChange = (e) => {
        setClassId(e.target.value);
    };
    const handleAttendanceTypeChange = (e) => {
        setAttendanceType(e.target.value);
    };
    const handleSubjectTypeChange = (e) => {
        setSubjectType(e.target.value);
    };

    const classIdOptions = [
        { label: 'CLS001', value: 'CLS001' },
        { label: 'CLS002', value: 'CLS002' },
        { label: 'CLS003', value: 'CLS003' },
        { label: 'CLS013', value: 'CLS013' },
    ];
    const attendanceTypeOptions = [
        { label: 'Acadamic', value: 'academic' },
        { label: 'Non-Acadamic', value: 'nonAcadamic' },
    ];
    const subjectTypeOptions = [
        { label: 'Cricket', value: 'SUB001' },
        { label: 'Basketball', value: 'SUB002' },
        { label: 'Science Club', value: 'SUB003' },
        { label: 'Maths Club', value: 'SUB004' },
    ];



    return (
        <Box ref={panelRef} sx={{
            height: '100%',
            minHeight: '100%',
            backgroundColor: '#EFF3FF',
            p: isExtraSmallPaper ? 1 : 4,
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                <Typography variant="h3" sx={{ mt: 2, ml: 0, mb: 3, color: '#333', fontWeight: 'bold', textAlign: isExtraSmallPaper ? 'center' : 'left' }}>
                    Student Attendance Entry
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: isExtraSmallPaper ? 'center' : 'flex-start', width: '100%' }}>
                    <Grid
                        container
                        spacing={2}
                        sx={{ width: '100%', maxWidth: 900, mb: 2, justifyContent: isExtraSmallPaper ? 'center' : 'flex-start' }}
                    // justifyContent="flex-start"
                    >
                        <Grid item xs={12} sm={6} md={3}>
                            <CustomDropdown
                                value={classId}
                                onChange={handleClassIdChange}
                                menuItems={classIdOptions}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <CustomDropdown
                                value={attendanceType}
                                onChange={handleAttendanceTypeChange}
                                menuItems={attendanceTypeOptions}
                            />
                        </Grid>

                        {attendanceType !== 'academic' && (
                            <Grid item xs={12} sm={6} md={3}>
                                <CustomDropdown
                                    value={subjectType}
                                    onChange={handleSubjectTypeChange}
                                    menuItems={subjectTypeOptions}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6} md={3}>
                            <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ maxWidth: '1000px', width: 'auto' }}>
                    <AttendanceTable
                        classId={classId}
                        attendanceType={attendanceType}
                        subjectType={subjectType}
                        selectedDate={selectedDate}
                        mode='edit'
                        panelSize={panelSize.width}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default TeacherAttendanceEntry;
{/* <Box sx={{ overflowX: 'auto' }}></Box> */ }