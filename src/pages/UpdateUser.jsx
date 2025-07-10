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
    Select,
    InputLabel,
} from "@mui/material";
import { tokens } from "../theme";

const Url = import.meta.env.VITE_BACKEND_URL;

// Updated subjects with proper structure
const subjects = [
    { code: "SUB001", name: "English" },
    { code: "SUB003", name: "Chemistry" },
    { code: "SUB004", name: "Biology" },
    { code: "SUB005", name: "History" },
    { code: "SUB006", name: "English Literature" },
    { code: "SUB007", name: "Computer Science" },
];

// Updated classes with proper structure
const classes = [
    { class_id: "CLS001", class_name: "10-A" },
    { class_id: "CLS002", class_name: "10-B" },
    { class_id: "CLS003", class_name: "11-A" },
    { class_id: "CLS004", class_name: "11-B" },
    { class_id: "CLS005", class_name: "12-A" },
    { class_id: "CLS013", class_name: "13-A" },
];

const UpdateUser = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [formData, setFormData] = useState({
        studentId: "",
        firstName: "",
        lastName: "",
        gender: "male", // Changed to lowercase to match your backend
        email: "",
        classId: "", // Changed to match backend field
        selectedSubjects: [], // This will store subject codes
        phoneNo: "",
    });

    const [alert, setAlert] = useState({ open: false, type: "", message: "" });

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSubjectToggle = (subjectCode) => {
        setFormData((prev) => {
            const updated = prev.selectedSubjects.includes(subjectCode)
                ? prev.selectedSubjects.filter((code) => code !== subjectCode)
                : [...prev.selectedSubjects, subjectCode];
            return { ...prev, selectedSubjects: updated };
        });
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.studentId || !formData.firstName || !formData.lastName || 
            !formData.email || !formData.classId || !formData.phoneNo) {
            setAlert({
                open: true,
                type: "error",
                message: "Please fill in all required fields!",
            });
            return;
        }

        const payload = {
            student_id: formData.studentId,
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            gender: formData.gender,
            email: formData.email,
            password: "defaultPassword123", // You might want to add a password field
            class_id: formData.classId,
            phone_no: formData.phoneNo,
            subject_id: formData.selectedSubjects, // This sends the subject codes
            join_date: new Date().toISOString().split('T')[0],
            last_edit_date: new Date().toISOString().split('T')[0],
            club_id: [],
            sport_id: [],
            role: "student"
        };

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${Url}/add-student`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to add student");
            }

            setAlert({
                open: true,
                type: "success",
                message: "Student added successfully!",
            });

            // Reset form
            setFormData({
                studentId: "",
                firstName: "",
                lastName: "",
                gender: "male",
                email: "",
                classId: "",
                selectedSubjects: [],
                phoneNo: "",
            });
        } catch (err) {
            setAlert({ open: true, type: "error", message: err.message });
        }
    };

    return (
        <Box p={4}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Update User
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
                    <Grid item xs={12} md={6}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            height="100%"
                        >
                            {/* Student ID */}
                            <Grid item xs={12}>
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="space-start"
                                    width="100%"
                                    gap={2}
                                >
                                    <Typography fontWeight="bold" fontSize={14} sx={{ mt: 1 }}>
                                        Student ID
                                    </Typography>
                                    <TextField
                                        size="small"
                                        sx={{ width: "48%" }}
                                        value={formData.studentId}
                                        onChange={handleChange("studentId")}
                                        placeholder="e.g., STU001"
                                    />
                                </Box>
                            </Grid>

                            {/* Name Fields */}
                            <Grid item xs={12}>
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="space-between"
                                    width="100%"
                                    sx={{ mt: 1 }}
                                >
                                    <Box display="flex"
                                        flexDirection="row"
                                        justifyContent="space-start"
                                        width="100%"
                                        gap={2}>
                                        <Typography fontWeight="bold" fontSize={14} sx={{ mt: 1 }}>
                                            First Name
                                        </Typography>
                                        <TextField
                                            size="small"
                                            sx={{ width: "48%" }}
                                            value={formData.firstName}
                                            onChange={handleChange("firstName")}
                                        />
                                    </Box>
                                    <Box display="flex"
                                        flexDirection="row"
                                        justifyContent="space-start"
                                        width="100%"
                                        gap={2}>
                                        <Typography fontWeight="bold" fontSize={14} sx={{ mt: 1 }}>
                                            Last Name
                                        </Typography>
                                        <TextField
                                            size="small"
                                            sx={{ width: "48%" }}
                                            value={formData.lastName}
                                            onChange={handleChange("lastName")}
                                        />
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Gender Field */}
                            <Grid item xs={12}>
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="space-start"
                                    width="100%"
                                    gap={2}
                                >
                                    <Typography fontWeight="bold" fontSize={14} sx={{ mt: 2 }}>
                                        Gender
                                    </Typography>
                                    <FormControl sx={{ mt: 1 }}>
                                        <RadioGroup
                                            row
                                            value={formData.gender}
                                            onChange={handleChange("gender")}
                                        >
                                            <FormControlLabel
                                                value="male"
                                                control={<Radio />}
                                                label="Male"
                                            />
                                            <FormControlLabel
                                                value="female"
                                                control={<Radio />}
                                                label="Female"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            </Grid>

                            {/* Email Field */}
                            <Grid item xs={12}>
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="space-between"
                                    gap={2}
                                >
                                    <Typography fontWeight="bold" fontSize={14} sx={{ mt: 1 }}>
                                        Email
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        value={formData.email}
                                        onChange={handleChange("email")}
                                        size="small"
                                        sx={{ mt: 1 }}
                                        type="email"
                                    />
                                </Box>
                            </Grid>

                            {/* Phone Number Field */}
                            <Grid item xs={12}>
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="space-between"
                                    gap={2}
                                >
                                    <Typography fontWeight="bold" fontSize={14} sx={{ mt: 1 }}>
                                        Phone No
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        value={formData.phoneNo}
                                        onChange={handleChange("phoneNo")}
                                        size="small"
                                        sx={{ mt: 1 }}
                                        placeholder="10 digits"
                                    />
                                </Box>
                            </Grid>

                            {/* Class Field */}
                            <Grid item xs={12}>
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="space-between"
                                    gap={2}
                                >
                                    <Typography fontWeight="bold" fontSize={14} sx={{ mt: 1 }}>
                                        Class
                                    </Typography>
                                    <FormControl fullWidth sx={{ mt: 1 }}>
                                        <Select
                                            value={formData.classId}
                                            onChange={handleChange("classId")}
                                            size="small"
                                            displayEmpty
                                        >
                                            <MenuItem value="">
                                                <em>Select a class</em>
                                            </MenuItem>
                                            {classes.map((cls) => (
                                                <MenuItem key={cls.class_id} value={cls.class_id}>
                                                    {cls.class_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>

                            {/* Subjects */}
                            <Grid item xs={12}>
                                <Box sx={{ mt: 2 }}>
                                    <Typography fontWeight="bold" fontSize={14} sx={{ mb: 1 }}>
                                        Subjects
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {[0, 1, 2].map((colIndex) => (
                                            <Grid item xs={12} md={4} key={colIndex}>
                                                <FormGroup>
                                                    {subjects
                                                        .filter((_, i) => i % 3 === colIndex)
                                                        .map((subject) => (
                                                            <FormControlLabel
                                                                key={subject.code}
                                                                control={
                                                                    <Checkbox
                                                                        checked={formData.selectedSubjects.includes(subject.code)}
                                                                        onChange={() => handleSubjectToggle(subject.code)}
                                                                    />
                                                                }
                                                                label={subject.name}
                                                            />
                                                        ))}
                                                </FormGroup>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Box mt={4}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ textTransform: "none", fontWeight: "bold", px: 5 }}
                                        onClick={handleSubmit}
                                    >
                                        Update Student
                                    </Button>
                                </Box>
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Empty spacer */}
                    <Grid item xs={12} md={6}></Grid>
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

export default UpdateUser;