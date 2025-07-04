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
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton
} from "@mui/material";
import { tokens } from "../theme";
import PersonIcon from "@mui/icons-material/Person";

const grades = Array.from({ length: 13 }, (_, i) => (i + 1).toString());
const userTypes = ["Student", "Teacher"];
const subjects = Array.from({ length: 12 }, (_, i) => `Subject ${i + 1}`);

// Sample data to populate the table
const sampleUsers = [
    { id: "116588", name: "Emma Johnson" },
    { id: "119582", name: "Noah Smith" },
    { id: "120995", name: "Olivia Brown" },
    { id: "121585", name: "Liam Williams" },
    { id: "200005", name: "Sophia Jones" },
    { id: "116588", name: "Emma Johnson" },
    { id: "119582", name: "Noah Smith" },
    { id: "120995", name: "Olivia Brown" },
    { id: "121585", name: "Liam Williams" },
    { id: "200005", name: "Sophia Jones" },
    { id: "116588", name: "Emma Johnson" },
    { id: "119582", name: "Noah Smith" },
    { id: "120995", name: "Olivia Brown" },
    { id: "121585", name: "Liam Williams" },
    { id: "200005", name: "Sophia Jones" },
];

const DeleteUser = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [searchId, setSearchId] = useState("");
    const [formData, setFormData] = useState({
        teacherId: "",
        firstName: "",
        lastName: "",
        grade: "",
        userType: "",
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
    };

    const handleDelete = (userId) => {
        console.log("Deleting user with ID:", userId);
    };

    return (
        <Box p={4}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Delete User
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
                    <Grid item xs={12}>
                        <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%" gap={10}>
                            <TextField
                                label="Select Type"
                                select
                                size="small"
                                value={formData.userType}
                                onChange={handleChange("userType")}
                                sx={{ width: "48%" }}
                            >
                                {userTypes.map((cls) => (
                                    <MenuItem key={cls} value={cls}>
                                        {cls}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                placeholder="Search by Id"
                                size="small"
                                value={formData.teacherId}
                                onChange={handleChange("teacherId")}
                                sx={{ width: "48%" }}
                            />
                        </Box>
                    </Grid>
                    {/* Table Section */}
                    <TableContainer
                        component={Paper}
                        
                        sx={{ mt: 4, borderRadius: 2, maxHeight: 400, overflowY: "auto" }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>Name</strong></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sampleUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <PersonIcon sx={{ color: "#0000FF" }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight="bold">{user.id}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight="bold">{user.name}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "#333",
                                                    borderRadius: "20px",
                                                    padding: "6px 16px",
                                                    textTransform: "none",
                                                    fontWeight: "bold",
                                                    "&:hover": {
                                                        backgroundColor: "#555",
                                                    },
                                                }}
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Grid>
            </Paper>
        </Box>
    );
};
export default DeleteUser;