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
} from "@mui/material";
import { tokens } from "../theme";

const grades = Array.from({ length: 13 }, (_, i) => (i + 1).toString());
const classes = ["A", "B", "C", "D", "E"]; // sample class list
const subjects = Array.from({ length: 12 }, (_, i) => `Subject ${i + 1}`);

const AddTeacher = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    teacherId: "",
    firstName: "",
    lastName: "",
    grade: "",
    class: "",
    selectedSubjects: [],
  });

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

  const handleSubmit = () => {
    console.log("Submitting Teacher:", formData);
    // You can post to API here
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

          {/* Empty spacer */}
          <Grid item xs={12} md={6}></Grid>

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

          {/* Grade */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Select Grade
            </Typography>
            <TextField
              select
              fullWidth
            //   label="Select grade"
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
            //   label="Select class"
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

export default AddTeacher;
