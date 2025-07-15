import React from 'react';
import { Box, Button, Card, Typography } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const DocumentCard = ({ doc, index, onView, onDelete, isDeleting }) => {
    return (
        <Card
            sx={{
                maxWidth: 1145,
                mb: 2,
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: 0,
                p: 2
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <InsertDriveFileIcon sx={{ width: 100, height: 100, color: '#90a4ae' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                            {`Document for ${new Date(doc.date).toLocaleDateString()} – Subject Code: ${doc.subject_id}`}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555' }}>
                            <span style={{ fontWeight: 600 }}>Student Id : </span>{doc.student_id}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555' }}>
                            <span style={{ fontWeight: 600 }}>Subject Id : </span>{doc.subject_id}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555' }}>
                            <span style={{ fontWeight: 600 }}>File Name : </span>{doc.file_name}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555' }}>
                            <span style={{ fontWeight: 600 }}>Submit Date : </span>{doc.date}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Button
                        variant="contained"
                        sx={{ 
                            backgroundColor: '#3674B5', 
                            borderRadius: '5px', 
                            width: '120px', 
                            height: '35px', 
                            boxShadow: 0,
                            '&:disabled': {
                                backgroundColor: '#3674B5',
                                opacity: 0.7
                            }
                        }}
                        onClick={() => onView(doc)}
                        disabled={isDeleting}
                    >
                        View
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ 
                            borderRadius: '5px', 
                            width: '120px', 
                            height: '35px', 
                            boxShadow: 0,
                            '&:disabled': {
                                borderColor: '#f44336',
                                color: '#f44336',
                                opacity: 0.7
                            }
                        }}
                        onClick={() => onDelete(doc)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default DocumentCard;