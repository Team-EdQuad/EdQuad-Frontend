import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    useTheme
} from '@mui/material';
import CustomDropdown from './CustomDropdown';
import DateSelector from './DateSelector';
import { format } from 'date-fns';
import AttendanceTable from './AttendanceTable';
import { ColorModeContext, tokens } from "../../theme";

const History = ({classId}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedDate, setSelectedDate] = useState('2025-01-06');
    const [attendanceType, setAttendanceType] = useState('academic');
    const [subjectType, setSubjectType] = useState('SUB001');

    const handleAttendanceTypeChange = (e) => {
        setAttendanceType(e.target.value);
    };
    const handleSubjectTypeChange = (e) => {
        setSubjectType(e.target.value);
    };

    const attendanceTypeOptions = [
        { label: 'Acadamic', value: 'academic' },
        { label: 'Non-Acadamic', value: 'nonAcademic' },
    ];
    const subjectTypeOptions = [
        { label: 'Cricket', value: 'SUB001' },
        { label: 'Basketball', value: 'SUB002' },
        { label: 'Science Club', value: 'SUB003' },
        { label: 'Maths Club', value: 'SUB004' },
    ];

    return (
        <Box sx={{
            height: '100%',
            backgroundColor: colors.nav_bg_2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflow: 'hidden'
        }}>
            <Paper sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 2,
                borderRadius: '10px',
                boxShadow: 'none',
                overflow: 'hidden'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2
                }}>
                    <Typography variant="h5" color="#000">History</Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        width: { xs: '100%', sm: 'auto' }
                    }}>
                        <CustomDropdown
                            value={attendanceType}
                            onChange={handleAttendanceTypeChange}
                            menuItems={attendanceTypeOptions}
                        />
                        {attendanceType !== 'academic' && (
                            <CustomDropdown
                                value={subjectType}
                                onChange={handleSubjectTypeChange}
                                menuItems={subjectTypeOptions}
                            />
                        )}
                        <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                    </Box>
                </Box>
                
                <Box sx={{ width: '100%', overflow: 'auto' }}>
                    <AttendanceTable
                        classId={classId}
                        attendanceType={attendanceType}
                        subjectType={subjectType}
                        selectedDate={selectedDate}
                        mode='view'
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default History;






// import React from 'react';
// import { Box, Typography, Paper } from '@mui/material';
// import CustomDropdown from '../../../components/CustomDropdown';
// import DateSelector from '../../../components/DateSelector';
// import AttendanceTable from '../../../components/AttendanceTable';

// const History = ({ filters, onChange }) => {
//     const { classId, attendanceType, subjectType, selectedDate } = filters;

//     const updateField = (key, value) => {
//         onChange({ ...filters, [key]: value });
//     };

//     const classIdOptions = [
//         { label: 'CLS001', value: 'CLS001' },
//         { label: 'CLS002', value: 'CLS002' },
//         { label: 'CLS003', value: 'CLS003' },
//         { label: 'CLS013', value: 'CLS013' },
//     ];
//     const attendanceTypeOptions = [
//         { label: 'Academic', value: 'academic' },
//         { label: 'Non-Academic', value: 'nonAcademic' },
//     ];
//     const subjectTypeOptions = [
//         { label: 'Cricket', value: 'SUB001' },
//         { label: 'Basketball', value: 'SUB002' },
//         { label: 'Science Club', value: 'SUB003' },
//         { label: 'Maths Club', value: 'SUB004' },
//     ];

//     return (
//         <Box sx={{
//             height: '100%',
//             width: '1145px',
//             backgroundColor: '#EFF3FF', // Change this to your desired background color
//             p: 0, // Optional: adds padding
//         }}>
//             <Paper
//                 sx={{
//                     height: 'auto',
//                     width: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     padding: 0,
//                     borderRadius: '10px',
//                     position: 'relative',
//                     boxShadow: 'none',
//                 }}
//             >
//                 <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Typography variant="h3" sx={{ mt: 2, ml: 2, mb: 3, color: '#333', fontWeight: 'bold', textAlign: 'left' }}>
//                         History
//                     </Typography>

//                     <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2, width: '100%', gap: 2 }}>
//                         <CustomDropdown
//                             value={classId}
//                             onChange={(e) => updateField('classId', e.target.value)}
//                             menuItems={classIdOptions}
//                         />
//                         <CustomDropdown
//                             value={attendanceType}
//                             onChange={(e) => updateField('attendanceType', e.target.value)}
//                             menuItems={attendanceTypeOptions}
//                         />
//                         {attendanceType !== 'academic' && (
//                             <CustomDropdown
//                                 value={subjectType}
//                                 onChange={(e) => updateField('subjectType', e.target.value)}
//                                 menuItems={subjectTypeOptions}
//                             />
//                         )}
//                         <DateSelector
//                             selectedDate={selectedDate}
//                             setSelectedDate={(date) => updateField('selectedDate', date)}
//                         />
//                     </Box>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', gap: 2, width: '100%' }}>
//                     <AttendanceTable
//                         classId={filters.classId}
//                         attendanceType={filters.attendanceType}
//                         subjectType={filters.subjectType}
//                         selectedDate={filters.selectedDate}
//                     />
//                 </Box>
//             </Paper>
//         </Box>
//     );
// };

// export default History;

