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
  

  const handleSubmit = () => {
    console.log("Submitting Student:", formData);
    // API call here
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
            />
          </Grid>
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
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}></Grid>

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
            />
          </Grid>

          {/* Class */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Select Class
            </Typography>
            <TextField
              select
              fullWidth
              label="Select class"
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
              Subject
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

export default AddStudent;
