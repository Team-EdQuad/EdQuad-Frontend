import React from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';

const CustomDropdown = ({ value, onChange, menuItems, placeholder = '', sx = {} }) => {
    return (
        <FormControl sx={{ minWidth: 172, ...sx }}>
            <Select
                value={value}
                onChange={onChange}
                displayEmpty
                sx={{
                    backgroundColor: '#EFF3FF',
                    borderRadius: '5px',
                    color: '#333',
                    height: 33,
                    marginRight: '3px',
                    fontSize: '0.9rem',
                    width: '100%',
                    '& .MuiSelect-icon': {
                        backgroundColor: '#D9D9D9',
                        color: '#000',
                        padding: '0px',
                        marginRight: '0px',
                        top: '0px',
                        right: '0px',
                        width: '33px',
                        height: '33px',
                        borderRadius: '0px 5px 5px 0px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D9D9D9',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D9D9D9',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D9D9D9',
                    },
                }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            backgroundColor: '#EFF3FF',
                            borderLeft: '2px solid #D9D9D9',
                            borderRight: '2px solid #D9D9D9',
                            borderBottom: 'solid #D9D9D9',
                            borderRadius: '0px 0px 5px 5px',
                            '& .MuiMenuItem-root': {
                                fontSize: '0.9rem',
                                '&:hover': {
                                    backgroundColor: '#00CADC20',
                                },
                                '&.Mui-selected': {
                                    backgroundColor: '#00CADC',
                                    color: 'white',
                                },
                            },
                        },
                    },
                }}
            >
                {placeholder && (
                    <MenuItem value="" disabled>{placeholder}</MenuItem>
                )}
                {menuItems.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CustomDropdown;
