import React, { useState, useCallback } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Checkbox, 
  FormControlLabel, 
  Button, 
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  TextField,
  Divider,
  useTheme,
  Alert,
  CircularProgress,
  Snackbar,
  FormHelperText
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
  EventAvailable, 
  Class, 
  Book, 
  CheckCircle, 
  Warning,
  Clear
} from '@mui/icons-material';
import axios from 'axios';

const attendanceModuleUrl = import.meta.env.VITE_ATTENDANCE_MODULE_BACKEND_URL;

// Constants
const CLASSES = [
  { id: 'CLS001', name: 'Class 6A' },
  { id: 'CLS002', name: 'Class 6B' },
  { id: 'CLS003', name: 'Class 7A' },
  { id: 'CLS004', name: 'Class 7B' },
  { id: 'CLS005', name: 'Class 8A' },
  { id: 'CLS006', name: 'Class 8B' },
  { id: 'CLS007', name: 'Class 9A' },
  { id: 'CLS008', name: 'Class 9B' },
  { id: 'CLS009', name: 'Class 10A' },
  { id: 'CLS010', name: 'Class 10B' },
  { id: 'CLS011', name: 'Class 11A' },
  { id: 'CLS012', name: 'Class 11B' },
];

const SUBJECTS = [
  { id: 'academic', name: 'Academic' },
];

const INITIAL_FEATURES = {
  is_exam_week: false,
  is_event_day: false,
  is_school_day: false
};

const FEATURE_LABELS = {
  is_exam_week: 'Exam Week',
  is_event_day: 'Event Day',
  is_school_day: 'School Day'
};

const AdminCalendar = () => {
  const theme = useTheme();
  
  // State management
  const [formData, setFormData] = useState({
    selectedDate: null,
    classId: '',
    subjectId: '',
    features: INITIAL_FEATURES
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Validation function
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.selectedDate) {
      newErrors.selectedDate = 'Please select a date';
    }
    
    if (!formData.classId) {
      newErrors.classId = 'Please select a class';
    }
    
    if (!formData.subjectId) {
      newErrors.subjectId = 'Please select a subject';
    }

    // Check if date is in the past
    if (formData.selectedDate && formData.selectedDate < new Date().setHours(0, 0, 0, 0)) {
      newErrors.selectedDate = 'Cannot select a past date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form field changes
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  }, [errors]);

  // Handle feature toggle
  const handleFeatureChange = useCallback((feature) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  }, []);

  // Show notification
  const showNotification = useCallback((message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  }, []);

  // Close notification
  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      selectedDate: null,
      classId: '',
      subjectId: '',
      features: INITIAL_FEATURES
    });
    setErrors({});
  }, []);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      showNotification('Please fix the errors before submitting', 'error');
      return;
    }

    setLoading(true);
    
    try {
      // Fix for timezone issue - ensure we get the correct date
      const date = new Date(formData.selectedDate);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      const requestData = {
        class_id: formData.classId,
        subject_id: formData.subjectId,
        date: formattedDate,
        features: Object.entries(formData.features).reduce((acc, [key, value]) => {
          acc[key] = value ? 1 : 0;
          return acc;
        }, {})
      };

      const response = await axios.post(
        `${attendanceModuleUrl}/store-calendar-event`, 
        requestData,
        {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.status === 200) {
        showNotification('Calendar event added successfully!');
        resetForm();
      }
    } catch (error) {
      console.error('Error adding calendar event:', error);
      
      let errorMessage = 'Failed to add calendar event. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.code === 'ECONNABORTED') {
        // Request timeout
        errorMessage = 'Request timeout. Please try again.';
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, showNotification, resetForm]);

  // Check if form has unsaved changes
  const hasUnsavedChanges = formData.selectedDate || formData.classId || formData.subjectId || 
    Object.values(formData.features).some(value => value);

  return (
    <Box p={4}>
      <Paper elevation={0} sx={{ p: 3, maxWidth: '1056px' }}>
        {/* Header */}
        <Box mb={4} display="flex" alignItems="center" gap={2}>
          <EventAvailable sx={{ fontSize: 35, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Calendar Event Management
          </Typography>
        </Box>

        {/* Form Content */}
        <Grid container spacing={4}>
          {/* Left Column - Date and Dropdowns */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: '10px' }}>
              <CardContent>
                <Typography variant="h5" mb={3} component="h2">
                  Event Details
                </Typography>

                <Box display="flex" flexDirection="column" gap={3}>
                  {/* Date Picker */}
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Select Date *"
                      value={formData.selectedDate}
                      onChange={(newValue) => handleFieldChange('selectedDate', newValue)}
                      minDate={new Date()}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth
                          error={!!errors.selectedDate}
                          helperText={errors.selectedDate}
                        />
                      )}
                    />
                  </LocalizationProvider>

                  {/* Class Selection */}
                  <FormControl fullWidth error={!!errors.classId}>
                    <InputLabel>Class *</InputLabel>
                    <Select
                      value={formData.classId}
                      label="Class *"
                      onChange={(e) => handleFieldChange('classId', e.target.value)}
                      startAdornment={<Class sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      {CLASSES.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.classId && (
                      <FormHelperText>{errors.classId}</FormHelperText>
                    )}
                  </FormControl>

                  {/* Subject Selection */}
                  <FormControl fullWidth error={!!errors.subjectId}>
                    <InputLabel>Subject *</InputLabel>
                    <Select
                      value={formData.subjectId}
                      label="Subject *"
                      onChange={(e) => handleFieldChange('subjectId', e.target.value)}
                      startAdornment={<Book sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      {SUBJECTS.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.subjectId && (
                      <FormHelperText>{errors.subjectId}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Features */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', borderRadius: '10px' }}>
              <CardContent>
                <Typography variant="h5" mb={3} component="h2">
                  Event Features
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                  {Object.entries(FEATURE_LABELS).map(([key, label]) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={formData.features[key]}
                          onChange={() => handleFeatureChange(key)}
                          color="primary"
                        />
                      }
                      label={label}
                    />
                  ))}
                </Box>

                {/* Feature Info */}
                <Box mt={3}>
                  <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                    <Typography variant="body2">
                      Select appropriate features for this calendar event to help with scheduling and attendance tracking.
                    </Typography>
                  </Alert>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={resetForm}
            disabled={loading || !hasUnsavedChanges}
            startIcon={<Clear />}
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Clear Form
          </Button>
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              minWidth: 180,
            }}
          >
            {loading ? 'Adding Event...' : 'Add Calendar Event'}
          </Button>
        </Box>
      </Paper>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminCalendar;