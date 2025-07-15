import React, { useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

import { ColorModeContext, tokens } from "../../theme";
import { useElementSize } from '../../hooks/useElementSize';

import AcadamicRatio from '../../components/Attendance-Module/Teacher-AcadamicRatio';
import NonAcadamicRatio from '../../components/Attendance-Module/Teacher-NonAcadamicRatio';
import AcadamicSummary from '../../components/Attendance-Module/Teacher-AcadamicSummary';
import NonAcadamicSummary from '../../components/Attendance-Module/Teacher-NonAcadamicSummary';
import History from '../../components/Attendance-Module/Teacher-History';
import CustomDropdown from '../../components/Attendance-Module/CustomDropdown';


const TeacherAnalysis = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [classId, setClassId] = useState('CLS001');
    const [panelRef, panelSize] = useElementSize();

    const handleClassIdChange = (e) => {
        setClassId(e.target.value);
    };

    const classIdOptions = [
        { label: 'Grade 6A', value: 'CLS001' },
        { label: 'Grade 6B', value: 'CLS002' },
        { label: 'Grade 7A', value: 'CLS003' },
        { label: 'Grade 7B', value: 'CLS004' },
        { label: 'Grade 8A', value: 'CLS005' },
        { label: 'Grade 8B', value: 'CLS006' },
        { label: 'Grade 9A', value: 'CLS007' },
        { label: 'Grade 9B', value: 'CLS008' },
        { label: 'Grade 10A', value: 'CLS009' },
        { label: 'Grade 10B', value: 'CLS010' },
        { label: 'Grade 11A', value: 'CLS011' },
        { label: 'Grade 11B', value: 'CLS012' }

    ];

    const isExtraSmallPaper = panelSize.width < 430;
    const isSmallPaper = panelSize.width < 650;
    const isMediumPaper = panelSize.width < 840;

    return (
        <Box ref={panelRef} sx={{
            height: '100%',
            backgroundColor: colors.nav_bg_2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            overflow: 'hidden',
            alignItems: 'flex-start'
        }}>
            <Box sx={{
                maxWidth: '1200px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                height: '100%',
                overflow: 'hidden'
            }}>
                <Typography variant="h4" sx={{ 
                    color: '#333', 
                    fontWeight: 'semibold',
                    px: 2,
                    marginTop: 4,
                }}>
                    Attendance Analysis
                </Typography>
                
                <Box sx={{ maxWidth: 200, px: 2 }}>
                    <CustomDropdown
                        value={classId}
                        onChange={handleClassIdChange}
                        menuItems={classIdOptions}
                    />
                </Box>

                <Box sx={{ 
                    display: 'flex',
                    gap: 2,
                    minHeight: '321px',
                    overflow: 'hidden'
                }}>
                    <Box sx={{ flexShrink: 0 }}>
                        <AcadamicRatio classId={classId} />
                    </Box>
                    <Box sx={{ 
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden'
                    }}>
                        <NonAcadamicRatio classId={classId} />
                    </Box>
                </Box>

                <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 2,
                    '& > *': { flexGrow: 1, minWidth: 'min(100%, 550px)' }
                }}>
                    <AcadamicSummary classId={classId} />
                    <NonAcadamicSummary classId={classId} />
                </Box>

                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <History classId={classId} />
                </Box>
            </Box>
        </Box>
    );
};

export default TeacherAnalysis; 