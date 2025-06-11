import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Paper,
  Button,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useTheme,
  FormControl,
  RadioGroup,
  Radio,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { tokens } from "../theme";
import { StoreContext } from "../context/StoreContext";

// Available subjects
const subjects = [
  { id: "SUB001", name: "Mathematics" },
  { id: "SUB002", name: "Physics" },
  { id: "SUB003", name: "Chemistry" },
  { id: "SUB004", name: "Biology" },
  { id: "SUB005", name: "History" },
  { id: "SUB006", name: "English Literature" },
  { id: "SUB007", name: "Computer Science" },
  { id: "SUB008", name: "Geography" },
  { id: "SUB009", name: "Economics" },
  { id: "SUB010", name: "Art" },
];

// Available classes
const availableClasses = [
  { id: "CLS001", name: "Grade 10-A" },
  { id: "CLS002", name: "Grade 10-B" },
  { id: "CLS003", name: "Grade 11-A" },
  { id: "CLS004", name: "Grade 11-B" },
  { id: "CLS005", name: "Grade 12-A" },
  { id: "CLS006", name: "Grade 12-B" },
  { id: "CLS007", name: "Grade 13-A" },
  { id: "CLS008", name: "Grade 13-B" },
];

const AddTeacher = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    teacher_id: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    gender: "male",
    Phone_no: "",
  });

  // Store subjects with their selected classes
  const [subjectClasses, setSubjectClasses] = useState({});
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // Handle subject selection/deselection
  const handleSubjectToggle = (subjectId) => {
    setSubjectClasses(prev => {
      const newSubjectClasses = { ...prev };
      if (newSubjectClasses[subjectId]) {
        // Remove subject and its classes
        delete newSubjectClasses[subjectId];
      } else {
        // Add subject with empty classes array
        newSubjectClasses[subjectId] = [];
      }
      return newSubjectClasses;
    });
  };

  // Handle class selection for a specific subject
  const handleClassToggle = (subjectId, classId) => {
    setSubjectClasses(prev => {
      const newSubjectClasses = { ...prev };
      if (!newSubjectClasses[subjectId]) {
        newSubjectClasses[subjectId] = [];
      }
      
      const classIndex = newSubjectClasses[subjectId].indexOf(classId);
      if (classIndex > -1) {
        // Remove class
        newSubjectClasses[subjectId] = newSubjectClasses[subjectId].filter(id => id !== classId);
      } else {
        // Add class
        newSubjectClasses[subjectId] = [...newSubjectClasses[subjectId], classId];
      }
      
      return newSubjectClasses;
    });
  };

  const validateForm = () => {
    const requiredFields = [
      'teacher_id', 'email', 'password', 'first_name', 
      'last_name', 'Phone_no'
    ];
    
    for (let field of requiredFields) {
      if (!formData[field]) {
        setAlert({
          open: true,
          type: "error",
          message: `Please fill in ${field.replace('_', ' ')}`
        });
        return false;
      }
    }

    const selectedSubjects = Object.keys(subjectClasses);
    if (selectedSubjects.length === 0) {
      setAlert({
        open: true,
        type: "error",
        message: "Please select at least one subject"
      });
      return false;
    }

    // Check if each selected subject has at least one class
    for (let subjectId of selectedSubjects) {
      if (!subjectClasses[subjectId] || subjectClasses[subjectId].length === 0) {
        const subject = subjects.find(s => s.id === subjectId);
        setAlert({
          open: true,
          type: "error",
          message: `Please select at least one class for ${subject?.name || subjectId}`
        });
        return false;
      }
    }

    return true;
  };

  const transformDataForAPI = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Transform subjectClasses object to the required array format
    const subjects_classes = Object.entries(subjectClasses).map(([subjectId, classIds]) => ({
      subject_id: subjectId,
      class_id: classIds
    }));

    return {
      teacher_id: formData.teacher_id,
      email: formData.email,
      password: formData.password,
      full_name: `${formData.first_name} ${formData.last_name}`.trim(),
      first_name: formData.first_name,
      last_name: formData.last_name,
      gender: formData.gender,
      Phone_no: formData.Phone_no,
      join_date: currentDate,
      last_edit_date: currentDate,
      subjects_classes: subjects_classes,
      role: "teacher"
    };
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const apiData = transformDataForAPI();
      
      console.log("Sending payload:", JSON.stringify(apiData, null, 2)); // Debug log

      const response = await fetch('http://127.0.0.1:8000/api/user-management/add-teacher', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();
      console.log("Response:", result); // Debug log
      
      if (response.ok) {
        setAlert({
          open: true,
          type: "success",
          message: result.message || "Teacher added successfully!",
        });
        
        // Reset form
        setFormData({
          teacher_id: "",
          email: "",
          password: "",
          first_name: "",
          last_name: "",
          gender: "male",
          Phone_no: "",
        });
        setSubjectClasses({});
      } else {
        setAlert({
          open: true,
          type: "error",
          message: result.detail || result.message || 'Failed to add teacher'
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setAlert({ 
        open: true, 
        type: "error", 
        message: error.message || "Failed to add teacher. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Teacher
      </Typography>

      <Paper
        elevation={3}
        sx={{
          mt: 4,
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          backgroundColor: colors.primary[400],
        }}
      >
        <Grid container spacing={3}>
          {/* Teacher ID */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Teacher ID *
            </Typography>
            <TextField
              fullWidth
              value={formData.teacher_id}
              onChange={handleChange("teacher_id")}
              size="small"
              sx={{ mt: 1 }}
              placeholder="e.g., TCH001"
              required
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Email *
            </Typography>
            <TextField
              fullWidth
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              size="small"
              sx={{ mt: 1 }}
              placeholder="e.g., teacher@example.com"
              required
            />
          </Grid>

          {/* First Name */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              First Name *
            </Typography>
            <TextField
              fullWidth
              value={formData.first_name}
              onChange={handleChange("first_name")}
              size="small"
              sx={{ mt: 1 }}
              placeholder="First name"
              required
            />
          </Grid>

          {/* Last Name */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Last Name *
            </Typography>
            <TextField
              fullWidth
              value={formData.last_name}
              onChange={handleChange("last_name")}
              size="small"
              sx={{ mt: 1 }}
              placeholder="Last name"
              required
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Password *
            </Typography>
            <TextField
              fullWidth
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              size="small"
              sx={{ mt: 1 }}
              placeholder="Password"
              required
            />
          </Grid>

          {/* Phone Number */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Phone Number *
            </Typography>
            <TextField
              fullWidth
              value={formData.Phone_no}
              onChange={handleChange("Phone_no")}
              size="small"
              sx={{ mt: 1 }}
              placeholder="e.g., 0712345678"
              required
            />
          </Grid>

          {/* Gender */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Gender *
            </Typography>
            <FormControl sx={{ mt: 1 }}>
              <RadioGroup
                row
                value={formData.gender}
                onChange={handleChange("gender")}
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Subjects and Classes Selection */}
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Subjects and Classes Assignment *
            </Typography>
            
            {/* Subject Selection */}
            <Typography fontWeight="bold" fontSize={14} sx={{ mb: 1 }}>
              Select Subjects:
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {subjects.map((subject) => (
                <Grid item xs={12} sm={6} md={4} key={subject.id}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={subjectClasses.hasOwnProperty(subject.id)}
                          onChange={() => handleSubjectToggle(subject.id)}
                        />
                      }
                      label={subject.name}
                    />
                  </FormGroup>
                </Grid>
              ))}
            </Grid>

            {/* Class Selection for each selected subject */}
            {Object.keys(subjectClasses).length > 0 && (
              <Box>
                <Divider sx={{ my: 2 }} />
                <Typography fontWeight="bold" fontSize={14} sx={{ mb: 2 }}>
                  Select Classes for Each Subject:
                </Typography>
                
                {Object.keys(subjectClasses).map((subjectId) => {
                  const subject = subjects.find(s => s.id === subjectId);
                  return (
                    <Card key={subjectId} sx={{ mb: 2, backgroundColor: colors.primary[500] }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          {subject?.name} - Select Classes:
                        </Typography>
                        <Grid container spacing={1}>
                          {availableClasses.map((cls) => (
                            <Grid item xs={12} sm={6} md={3} key={cls.id}>
                              <FormGroup>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={subjectClasses[subjectId]?.includes(cls.id) || false}
                                      onChange={() => handleClassToggle(subjectId, cls.id)}
                                    />
                                  }
                                  label={cls.name}
                                />
                              </FormGroup>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                sx={{ 
                  textTransform: "none", 
                  fontWeight: "bold",
                  px: 5,
                  position: "relative"
                }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading && (
                  <CircularProgress
                    size={20}
                    sx={{
                      position: "absolute",
                      left: "50%",
                      marginLeft: "-10px",
                    }}
                  />
                )}
                {loading ? "Adding Teacher..." : "Submit"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={alert.type}
          variant="filled"
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddTeacher;
