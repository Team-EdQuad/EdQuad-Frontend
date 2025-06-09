import React, { useState, useContext } from "react";
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
import { StoreContext } from "../context/StoreContext";

// Replace the old subjects array with this:
const subjects = [
  { code: "SUB003", name: "Chemistry" },
  { code: "SUB004", name: "Biology" },
  { code: "SUB005", name: "History" },
  { code: "SUB006", name: "English Literature" },
  { code: "SUB007", name: "Computer Science" },
  { code: "string", name: "Unknown Subject" },
];

// Replace the old classes array with this:
const classes = [
  { class_id: "CLS001", class_name: "10-A" },
  { class_id: "CLS002", class_name: "10-B" },
  { class_id: "CLS003", class_name: "11-A" },
  { class_id: "CLS004", class_name: "11-B" },
  { class_id: "CLS005", class_name: "12-A" },
  { class_id: "CLS013", class_name: "13-A" },
];

const AddStudent = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    gender: "male",
    class_id: "",
    phone: "",
    subject: [],
    join_date: "",
    last_edit_date: "",
    club_id: [],
    sport_id: [],
    role: "student",
  });

  const [alert, setAlert] = useState({ open: false, type: "", message: "" });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubjectToggle = (subjectCode) => {
    setFormData((prev) => {
      const updated = prev.subject.includes(subjectCode)
        ? prev.subject.filter((s) => s !== subjectCode)
        : [...prev.subject, subjectCode];
      return { ...prev, subject: updated };
    });
  };

  const handleSubmit = async () => {
    // Auto-fill full_name, join_date, last_edit_date
    const today = new Date().toISOString().slice(0, 10);
    const payload = {
      ...formData,
      full_name: `${formData.first_name} ${formData.last_name}`,
      join_date: formData.join_date || today,
      last_edit_date: formData.last_edit_date || today,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/user-management/add-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use token from context
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to add student");
      }

      const data = await res.json();
      setAlert({
        open: true,
        type: "success",
        message: "Student added successfully!",
      });

      setFormData({
        student_id: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        gender: "male",
        class_id: "",
        phone: "",
        subject: [],
        join_date: "",
        last_edit_date: "",
        club_id: [],
        sport_id: [],
        role: "student",
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
              value={formData.student_id}
              onChange={handleChange("student_id")}
              size="small"
              sx={{ mt: 1 }}
              placeholder="e.g., STU001"
            />
          </Grid>
          {/* First Name */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              First Name
            </Typography>
            <TextField
              fullWidth
              value={formData.first_name}
              onChange={handleChange("first_name")}
              size="small"
              sx={{ mt: 1 }}
              placeholder="First name"
            />
          </Grid>
          {/* Last Name */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Last Name
            </Typography>
            <TextField
              fullWidth
              value={formData.last_name}
              onChange={handleChange("last_name")}
              size="small"
              sx={{ mt: 1 }}
              placeholder="Last name"
            />
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
              placeholder="Password"
            />
          </Grid>
          {/* Phone */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Phone
            </Typography>
            <TextField
              fullWidth
              value={formData.phone}
              onChange={handleChange("phone")}
              size="small"
              sx={{ mt: 1 }}
              placeholder="e.g., 0712345678"
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
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {/* Class */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Class
            </Typography>
            <TextField
              select
              fullWidth
              value={formData.class_id}
              onChange={handleChange("class_id")}
              size="small"
              label="Select class"
              sx={{ mt: 1 }}
            >
              {classes.map((cls) => (
                <MenuItem key={cls.class_id} value={cls.class_id}>
                  {cls.class_name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* Join Date */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Join Date
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={formData.join_date}
              onChange={handleChange("join_date")}
              size="small"
              sx={{ mt: 1 }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {/* Last Edit Date */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Last Edit Date
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={formData.last_edit_date}
              onChange={handleChange("last_edit_date")}
              size="small"
              sx={{ mt: 1 }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {/* Subjects */}
          <Grid item xs={12}>
            <Typography fontWeight="bold" fontSize={14} sx={{ mb: 1 }}>
              Subjects
            </Typography>
            <Grid container spacing={2}>
              {subjects.map((subject) => (
                <Grid item xs={12} sm={6} md={3} key={subject.code}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.subject.includes(subject.code)}
                          onChange={() => handleSubjectToggle(subject.code)}
                        />
                      }
                      label={subject.name}
                    />
                  </FormGroup>
                </Grid>
              ))}
            </Grid>
          </Grid>
          {/* Role */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Role
            </Typography>
            <TextField
              select
              fullWidth
              value={formData.role}
              onChange={handleChange("role")}
              size="small"
              label="Select role"
              sx={{ mt: 1 }}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Grid>
          {/* Club and Sport IDs (optional, as comma-separated) */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Club IDs (comma separated)
            </Typography>
            <TextField
              fullWidth
              value={formData.club_id.join(",")}
              onChange={(e) =>
                setFormData({ ...formData, club_id: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })
              }
              size="small"
              sx={{ mt: 1 }}
              placeholder="e.g., CLUB001,CLUB002"
            />
            <Typography fontWeight="bold" fontSize={14} sx={{ mt: 2 }}>
              Sport IDs (comma separated)
            </Typography>
            <TextField
              fullWidth
              value={formData.sport_id.join(",")}
              onChange={(e) =>
                setFormData({ ...formData, sport_id: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })
              }
              size="small"
              sx={{ mt: 1 }}
              placeholder="e.g., SPORT001,SPORT002"
            />
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
