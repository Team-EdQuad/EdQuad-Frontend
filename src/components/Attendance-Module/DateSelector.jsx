// import * as React from 'react';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import TextField from '@mui/material/TextField';
// import { format } from 'date-fns'; // Make sure date-fns is installed

// const DateSelector = ({ selectedDate, setSelectedDate }) => {

//     React.useEffect(() => {
//         console.log('Selected date:', selectedDate);
//     }, [selectedDate]);

//     return (
//         <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//                 // label="Select date"
//                 value={selectedDate}
//                 maxDate={new Date()} // restrict future dates
//                 onChange={(newValue) => {
//                     if (newValue) {
//                         const formattedDate = format(newValue, 'yyyy-MM-dd');
//                         setSelectedDate(formattedDate);
//                     }
//                 }}
//                 renderInput={(params) => (
//                     <TextField
//                         {...params}
//                         size="small"
//                         InputProps={{
//                             ...params.InputProps,
//                             sx: {
//                                 height: 33,
//                                 fontSize: '0.9rem',
//                                 paddingRight: '0px',
//                                 backgroundColor: '#EFF3FF',
//                                 borderRadius: '5px',
//                                 '& .MuiSvgIcon-root': {
//                                     fontSize: '20px', // Adjust calendar icon size
//                                 },
//                             },
//                         }}
//                         sx={{
//                             width: 172,
//                             '& .MuiOutlinedInput-notchedOutline': {
//                                 borderColor: '#D9D9D9',
//                             },
//                             '&:hover .MuiOutlinedInput-notchedOutline': {
//                                 borderColor: '#D9D9D9',
//                             },
//                             '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                 borderColor: '#00CADC',
//                             },
//                         }}
//                     />


//                 )}
//             />

//         </LocalizationProvider>
//     );
// };


// export default DateSelector;


import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { parse, format } from 'date-fns'; // using parse also

const DateSelector = ({ selectedDate, setSelectedDate }) => {

    const parsedDate = selectedDate ? parse(selectedDate, 'yyyy-MM-dd', new Date()) : null;

    React.useEffect(() => {
        console.log('Selected date:', selectedDate);
    }, [selectedDate]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                value={parsedDate}
                maxDate={new Date()}
                onChange={(newValue) => {
                    if (newValue) {
                        const formattedDate = format(newValue, 'yyyy-MM-dd');
                        setSelectedDate(formattedDate);
                    } else {
                        setSelectedDate('');
                    }
                }}
                disablePortal
                slotProps={{
                    textField: {
                        size: 'small',
                        sx: {
                            width: 172,
                            backgroundColor: '#EFF3FF',
                            borderRadius: '5px',
                            '& .MuiOutlinedInput-root': {
                                height: 33,
                                fontSize: '0.9rem',
                                paddingRight: 0,
                                '& .MuiSvgIcon-root': {
                                    fontSize: '20px',
                                },
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#D9D9D9',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#D9D9D9',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#00CADC',
                            },
                        },
                    },
                    popper: {
                        sx: {
                            '& .MuiPaper-root': {
                                borderRadius: 2,
                                backgroundColor: '#f9f9f9',
                                boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                                padding: 1,
                            },
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );

};

export default DateSelector;
