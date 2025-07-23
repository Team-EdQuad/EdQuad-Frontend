import React, { useState, useContext } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { StoreContext } from '../../context/StoreContext';

const attendanceModuleUrl = import.meta.env.VITE_ATTENDANCE_MODULE_BACKEND_URL;

const FileUploadForm = ({ student_id, class_id, subject_id, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const { showNotification } = useContext(StoreContext);

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            validateAndSetFile(droppedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const validateAndSetFile = (file) => {
        // Validate file type and size
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            showNotification('Please upload a PDF, JPEG, or PNG file', 'error');
            return;
        }

        if (file.size > maxSize) {
            showNotification('File size should not exceed 5MB', 'error');
            return;
        }

        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            validateAndSetFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            showNotification('Please select a file first', 'warning');
            return;
        }

        if (!student_id || !class_id) {
            showNotification('Missing required information', 'error');
            return;
        }

        setIsUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('student_id', student_id);
        data.append('class_id', class_id);
        data.append('subject_id', subject_id || 'academic');
        data.append('date', new Date().toISOString().slice(0, 10));

        try {
            const response = await fetch(`${attendanceModuleUrl}/document-upload`, {
                method: 'POST',
                body: data,
            });
            if (response.ok) {
                showNotification('File uploaded successfully', 'success');
                if (onUploadSuccess) {
                    onUploadSuccess();
                }
                setFile(null);
                setPreviewUrl(null);
            } else {
                const errorData = await response.json();
                showNotification(errorData.message || 'Upload failed', 'error');
            }
        } catch (error) {
            console.error(error);
            showNotification('An error occurred during upload', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        setFile(null);
        setPreviewUrl(null);
        showNotification('Upload cancelled', 'info');
    };

    return (
        <Box py={4} sx={{ maxWidth: 1145, height: 'auto' }}>
            <Paper
                variant="outlined"
                sx={{
                    border: '2px dashed #ccc',
                    textAlign: 'center',
                    py: 6,
                    mb: '20px',
                    bgcolor: '#f4f6fd',
                    cursor: 'pointer',
                    position: 'relative',
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('fileInput').click()}
            >
                {!file && (
                    <Box>
                        <CloudUploadIcon sx={{ fontSize: 48 }} />
                        <Typography variant="subtitle1" color="textSecondary">
                            Drop file or select file
                        </Typography>
                    </Box>
                )}
                {file && (
                    <Box>
                        <Typography variant="subtitle1">
                            Selected file: {file.name}
                        </Typography>
                        {previewUrl && file.type.startsWith('image/') && (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{ maxWidth: '200px', marginTop: '10px' }}
                            />
                        )}
                    </Box>
                )}
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png"
                />
            </Paper>

            {file && (
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancel}
                        disabled={isUploading}
                        sx={{ borderRadius: '5px', width: '120px', height: '35px', boxShadow: 0 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={isUploading}
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
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default FileUploadForm;

