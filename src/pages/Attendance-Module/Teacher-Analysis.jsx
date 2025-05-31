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
    const [classId, setClassId] = useState('CLS013');
    const [panelRef, panelSize] = useElementSize();

    const handleClassIdChange = (e) => {
        setClassId(e.target.value);
    };

    const classIdOptions = [
        { label: 'CLS001', value: 'CLS001' },
        { label: 'CLS002', value: 'CLS002' },
        { label: 'CLS003', value: 'CLS003' },
        { label: 'CLS013', value: 'CLS013' },
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
                <Typography variant="h3" sx={{ 
                    color: '#333', 
                    fontWeight: 'bold',
                    px: 2
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