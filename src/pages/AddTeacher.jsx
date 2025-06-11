import React, { useState } from "react";
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
  Alert,
} from "@mui/material";
import { tokens } from "../theme";

// Sample data (replace with API calls if available)
const grades = Array.from({ length: 13 }, (_, i) => (i + 1).toString());
const classes = ["A", "B", "C", "D", "E"];
const subjects = Array.from({ length: 12 }, (_, i) => `SUB${i + 1}`); // Adjusted to use SUB001 format
const genderOptions = ["male", "female", "other"];

const AddTeacher = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    teacherId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    phoneNo: "",
    joinDate: "",
    grade: "",
    class: "",
    selectedSubjects: [],
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubjectToggle = (subject) => {
    setFormData((prev) => {
      const updatedSubjects = prev.selectedSubjects.includes(subject)
        ? prev.selectedSubjects.filter((s) => s !== subject)
        : [...prev.selectedSubjects, subject];
      return { ...prev, selectedSubjects: updatedSubjects };
    });
  };

  const handleSubmit = async () => {
    // Basic validation
    if (
      !formData.teacherId ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.gender ||
      !formData.phoneNo ||
      !formData.joinDate ||
      !formData.grade ||
      !formData.class ||
      formData.selectedSubjects.length === 0
    ) {
      setError("Please fill in all required fields and select at least one subject.");
      return;
    }

    // Structure subjects_classes
    const subjectsClasses = formData.selectedSubjects.map((subject) => ({
      subject_id: subject,
      class_id: [`CLS${formData.grade}${formData.class}`], // Example: CLS1A
    }));

    const payload = {
      teacher_id: formData.teacherId,
      email: formData.email,
      password: formData.password,
      full_name: `${formData.firstName} ${formData.lastName}`,
      first_name: formData.firstName,
      last_name: formData.lastName,
      gender: formData.gender,
      Phone_no: formData.phoneNo,
      join_date: formData.joinDate,
      last_edit_date: formData.joinDate, // Using joinDate for last_edit_date as per example
      subjects_classes: subjectsClasses,
      role: "teacher",
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user-management/add-teacher", {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzd禁止: " + process.env.REACT_APP_JWT_SECRET + ".5iIzeX-X_QVAuryaz8UWdHPtEHdFHDN0PMshhkAMYhk",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Teacher added successfully");
        setError(null);
        // Reset form
        setFormData({
          teacherId: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          gender: "",
          phoneNo: "",
          joinDate: "",
          grade: "",
          class: "",
          selectedSubjects: [],
        });
      } else {
        setError(data.message || "Failed to add teacher");
        setMessage(null);
      }
    } catch (err) {
      setError("An error occurred while adding the teacher");
      setMessage(null);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Teacher
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
              Teacher ID
            </Typography>
            <TextField
              fullWidth
              value={formData.teacherId}
              onChange={handleChange("teacherId")}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Email
            </Typography>
            <TextField
              fullWidth
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>

          {/* First Name */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              First Name
            </Typography>
            <TextField
              fullWidth
              value={formData.firstName}
              onChange={handleChange("firstName")}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>

          {/* Last Name */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Last Name
            </Typography>
            <TextField
              fullWidth
              value={formData.lastName}
              onChange={handleChange("lastName")}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>

          {/* Gender */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Gender
            </Typography>
            <TextField
              select
              fullWidth
              value={formData.gender}
              onChange={handleChange("gender")}
              size="small"
              sx={{ mt: 1 }}
            >
              {genderOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Phone Number */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Phone Number
            </Typography>
            <TextField
              fullWidth
              value={formData.phoneNo}
              onChange={handleChange("phoneNo")}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>

          {/* Join Date */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Join Date
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={formData.joinDate}
              onChange={handleChange("joinDate")}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>

          {/* Grade */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Select Grade
            </Typography>
            <TextField
              select
              fullWidth
              value={formData.grade}
              onChange={handleChange("grade")}
              size="small"
              sx={{ mt: 1 }}
            >
              {grades.map((grade) => (
                <MenuItem key={grade} value={grade}>
                  {grade}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Class */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Select Class
            </Typography>
            <TextField
              select
              fullWidth
              value={formData.class}
              onChange={handleChange("class")}
              size="small"
              sx={{ mt: 1 }}
            >
              {classes.map((cls) => (
                <MenuItem key={cls} value={cls}>
                  {cls}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Subjects */}
          <Grid item xs={12}>
            <Typography fontWeight="bold" fontSize={14} sx={{ mb: 1 }}>
              Subjects
            </Typography>
            <Grid container spacing={2}>
              {subjects.map((subject, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.selectedSubjects.includes(subject)}
                          onChange={() => handleSubjectToggle(subject)}
                        />
                      }
                      label={subject}
                    />
                  </FormGroup>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                sx={{ textTransform: "none", fontWeight: "bold" }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AddTeacher;