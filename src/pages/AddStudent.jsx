import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Paper,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  useTheme,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { tokens } from "../theme";

const subjects = Array.from({ length: 12 }, (_, i) => `Subject ${i + 1}`);
const classes = ["A", "B", "C", "D", "E"];

const AddStudent = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    gender: "Male",
    email: "",
    class: "",
    selectedSubjects: [],
  });

  const [alert, setAlert] = useState({ open: false, type: "", message: "" });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubjectToggle = (subject) => {
    setFormData((prev) => {
      const updated = prev.selectedSubjects.includes(subject)
        ? prev.selectedSubjects.filter((s) => s !== subject)
        : [...prev.selectedSubjects, subject];
      return { ...prev, selectedSubjects: updated };
    });
  };

  const handleSubmit = async () => {
    const payload = {
      studentId: formData.studentId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      email: formData.email,
      class: formData.class,
      subjects: formData.selectedSubjects,
    };

    try {
      const res = await fetch("http://localhost:8000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add student");

      setAlert({
        open: true,
        type: "success",
        message: "Student added successfully!",
      });

      // Optional: Reset form
      setFormData({
        studentId: "",
        firstName: "",
        lastName: "",
        gender: "Male",
        email: "",
        class: "",
        selectedSubjects: [],
      });
    } catch (err) {
      setAlert({ open: true, type: "error", message: err.message });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Add Student
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
          {/* Student ID */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Student ID
            </Typography>
            <TextField
              fullWidth
              value={formData.studentId}
              onChange={handleChange("studentId")}
              size="small"
              sx={{ mt: 1 }}
              placeholder="e.g., STU001"
            />
          </Grid>

          {/* Empty spacer */}
          <Grid item xs={12} md={6}></Grid>

          {/* First and Last Name */}
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
              placeholder="First name"
            />
          </Grid>
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
              placeholder="Last name"
            />
          </Grid>

          {/* Gender */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Gender
            </Typography>
            <FormControl sx={{ mt: 1 }}>
              <RadioGroup
                row
                value={formData.gender}
                onChange={handleChange("gender")}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Email
            </Typography>
            <TextField
              fullWidth
              value={formData.email}
              onChange={handleChange("email")}
              size="small"
              sx={{ mt: 1 }}
              placeholder="e.g., student@example.com"
            />
          </Grid>

          {/* Class */}
          <Grid item xs={12} md={6} sx={{ width: "100%" }}>
            <Typography fontWeight="bold" fontSize={14}>
              Class
            </Typography>
            <TextField
              select
              fullWidth
              value={formData.class}
              onChange={handleChange("class")}
              size="medium"
              label="Select class"
              sx={{
                mt: 1,
                width: "10%", 
              }}
             
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
              {subjects.map((subject) => (
                <Grid item xs={12} sm={6} md={3} key={subject}>
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
                sx={{ textTransform: "none", fontWeight: "bold", px: 5 }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
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

export default AddStudent;
