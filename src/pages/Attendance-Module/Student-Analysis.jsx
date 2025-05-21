import React, { useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useState, useContext } from 'react';

import { ColorModeContext, tokens } from "../../theme";
import { useElementSize } from '../../hooks/useElementSize';
import { StoreContext } from '../../context/StoreContext';

import AcadamicRatio from '../../components/Attendance-Module/Student-AcadamicRatio';
import NonAcadamicRatio from '../../components/Attendance-Module/Student-NonAcadamicRatio';
import AcadamicSummary from '../../components/Attendance-Module/Student-AcadamicSummary';
import NonAcadamicSummary from '../../components/Attendance-Module/Student-NonAcadamicSummary';


const StudentAnalysis = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useContext(StoreContext);
    const [panelRef, panelSize] = useElementSize();

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

                <Box sx={{ 
                    display: 'flex',
                    gap: 2,
                    minHeight: '321px',
                    overflow: 'hidden'
                }}>
                    <Box sx={{ flexShrink: 0 }}>
                        <AcadamicRatio studentId={id} />
                    </Box>
                    <Box sx={{ 
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden'
                    }}>
                        <NonAcadamicRatio studentId={id} />
                    </Box>
                </Box>

                <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 2,
                    '& > *': { flexGrow: 1, minWidth: 'min(100%, 550px)' }
                }}>
                    <AcadamicSummary studentId={id} />
                    <NonAcadamicSummary studentId={id} />
                </Box>

                {/* <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <History studentId={id} />
                </Box> */}
            </Box>
        </Box>
    );
};

export default StudentAnalysis; 