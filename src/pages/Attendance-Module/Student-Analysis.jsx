import React, { useRef } from 'react';
import { Box, Typography, useTheme, CircularProgress } from '@mui/material';
import { useState, useContext } from 'react';

import { ColorModeContext, tokens } from "../../theme";
import { useElementSize } from '../../hooks/useElementSize';
import { StoreContext } from '../../context/StoreContext';

import AcadamicRatio from '../../components/Attendance-Module/Student-AcadamicRatio';
import NonAcadamicRatio from '../../components/Attendance-Module/Student-NonAcadamicRatio';
import AcadamicSummary from '../../components/Attendance-Module/Student-AcadamicSummary';
import NonAcadamicSummary from '../../components/Attendance-Module/Student-NonAcadamicSummary';

const LoadingOverlay = () => (
    <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1,
        borderRadius: 'inherit'
    }}>
        <CircularProgress />
    </Box>
);

const StudentAnalysis = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id:studentId } = useContext(StoreContext);
    const [panelRef, panelSize] = useElementSize();

    console.log(studentId);

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
                overflow: 'hidden',
                pt: 4
            }}>
                <Typography variant="h3" sx={{ 
                    color: '#333', 
                    fontWeight: 'bold',
                    px: 2
                }}>
                    Attendance Analysis
                </Typography>

                <Box sx={{ 
                    display: 'flex',
                    gap: 2,
                    minHeight: '321px',
                    overflow: 'hidden'
                }}>
                    <Box sx={{ flexShrink: 0, position: 'relative' }}>
                        <AcadamicRatio studentId={studentId} />
                    </Box>
                    <Box sx={{ 
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <NonAcadamicRatio studentId={studentId} />
                    </Box>
                </Box>

                <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 2,
                    '& > *': { 
                        flexGrow: 1, 
                        minWidth: 'min(100%, 550px)',
                        position: 'relative'
                    }
                }}>
                    <AcadamicSummary studentId={studentId} />
                    <NonAcadamicSummary studentId={studentId} />
                </Box>
            </Box>
        </Box>
    );
};

export default StudentAnalysis; 