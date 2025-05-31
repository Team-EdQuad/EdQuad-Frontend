import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUploadForm = ({ student_id, class_id, subject_id, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        generatePreview(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
        generatePreview(droppedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const generatePreview = (file) => {
        if (file && file.type.startsWith('image/')) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async () => {
        if (!file || !student_id || !class_id) {
            alert('Please fill in all required fields and choose a file.');
            return;
        }

        const data = new FormData();
        data.append('file', file);
        data.append('student_id', student_id);
        data.append('class_id', class_id);
        data.append('subject_id', subject_id || 'academic');
        data.append('date', new Date().toISOString().slice(0, 10));

        try {
            const response = await fetch('http://127.0.0.1:8000/attendance/document-upload', {
                method: 'POST',
                body: data,
            });
            if (response.ok) {
                alert('File uploaded successfully');
                if (onUploadSuccess) {
                    onUploadSuccess();  // 🔁 Notify parent to refresh
                }
                setFile(null);
                setPreviewUrl(null);
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        }
    };

    const handleCancel = () => {
        setFile(null);
        setPreviewUrl(null);
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

                {file && previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '176px' }}
                    />
                )}

                {file && !previewUrl && (
                    <Typography variant="subtitle1">{file.name}</Typography>
                )}

                <input
                    id="fileInput"
                    type="file"
                    hidden
                    onChange={handleFileChange}
                />
            </Paper>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ backgroundColor: '#3674B5', borderRadius: '5px', width: '120px', height: '35px', boxShadow: 0 }}
                >
                    Submit
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                    sx={{ borderRadius: '5px', width: '120px', height: '35px', boxShadow: 0 }}
                >
                    Cancel
                </Button>
            </Stack>
        </Box>
    );
};

export default FileUploadForm;

