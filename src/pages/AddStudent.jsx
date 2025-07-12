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
  CircularProgress,
} from "@mui/material";
import { tokens } from "../theme";
import { StoreContext } from "../context/StoreContext";
const Url = import.meta.env.VITE_BACKEND_URL;


const subjects = [
  { code: "SUB001", name: "English" },
  { code: "SUB002", name: "Physics" },
  { code: "SUB003", name: "Chemistry" },
  { code: "SUB004", name: "Biology" },
  { code: "SUB005", name: "History" },
  { code: "SUB006", name: "English Literature" },
  { code: "SUB007", name: "Computer Science" },
];

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
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    const requiredFields = [
      'student_id', 'first_name', 'last_name', 
      'email', 'password', 'class_id', 'phone'
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

    if (formData.subject.length === 0) {
      setAlert({
        open: true,
        type: "error",
        message: "Please select at least one subject"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    
    const payload = {
      ...formData,
      phone_no: formData.phone,
      subject_id: formData.subject,
      full_name: `${formData.first_name} ${formData.last_name}`.trim(),
      join_date: formData.join_date || today,
      last_edit_date: formData.last_edit_date || today,
    };
    delete payload.phone;
    delete payload.subject;
    console.log("Sending payload:", payload); // Debug log
    console.log("Using token:", token ? "Token present" : "No token"); // Debug log

    try {
      const response = await fetch(`${Url}/api/user-management/add-student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status); // Debug log

      const responseData = await response.json();
      console.log("Response data:", responseData); // Debug log

      if (!response.ok) {
        throw new Error(
          // responseData.detail || 
          // responseData.message || 
          typeof responseData.detail === "string"
            ? responseData.detail
            : responseData.message ||
              JSON.stringify(responseData) || 
              `HTTP error! status: ${response.status}`
        );
      }

      setAlert({
        open: true,
        type: "success",
        message: responseData.message || "Student added successfully!",
      });

      // Reset form on success
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

    } catch (error) {
      console.error("Submit error:", error); // Debug log
      setAlert({ 
        open: true, 
        type: "error", 
        message: error.message || "Failed to add student. Please try again." 
      });
    } finally {
      setLoading(false);
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
              Student ID *
            </Typography>
            <TextField
              fullWidth
              value={formData.student_id}
              onChange={handleChange("student_id")}
              size="small"
              sx={{ mt: 1 }}
              placeholder="e.g., STU001"
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
              placeholder="e.g., student@example.com"
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

          {/* Phone */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Phone *
            </Typography>
            <TextField
              fullWidth
              value={formData.phone}
              onChange={handleChange("phone")}
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

          {/* Class */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Class *
            </Typography>
            <TextField
              select
              fullWidth
              value={formData.class_id}
              onChange={handleChange("class_id")}
              size="small"
              sx={{ mt: 1 }}
              required
            >
              <MenuItem value="">Select a class</MenuItem>
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
              Subjects *
            </Typography>
            <Grid container spacing={2}>
              {subjects.map((subject) => (
                <Grid item xs={12} sm={6} md={4} key={subject.code}>
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

          {/* Club and Sport IDs */}
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Club IDs (comma separated)
            </Typography>
            <TextField
              fullWidth
              value={formData.club_id.join(",")}
              onChange={(e) =>
                setFormData({ 
                  ...formData, 
                  club_id: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
                })
              }
              size="small"
              sx={{ mt: 1 }}
              placeholder="e.g., CLB001,CLB002"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={14}>
              Sport IDs (comma separated)
            </Typography>
            <TextField
              fullWidth
              value={formData.sport_id.join(",")}
              onChange={(e) =>
                setFormData({ 
                  ...formData, 
                  sport_id: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
                })
              }
              size="small"
              sx={{ mt: 1 }}
              placeholder="e.g., SPT001,SPT002"
            />
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
                {loading ? "Adding Student..." : "Submit"}
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

export default AddStudent;
