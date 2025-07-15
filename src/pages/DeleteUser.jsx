import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Typography,
    Grid,
    TextField,
    Paper,
    Button,
    MenuItem,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress, // For loading indicator
    Alert, // For success/error messages
} from "@mui/material";
import { tokens } from "../theme"; // Assuming theme.js is one level up from src/pages/DeleteUser.jsx
import PersonIcon from "@mui/icons-material/Person";

const Url = import.meta.env.VITE_BACKEND_URL;

const DeleteUser = () => {
    console.log("DeleteUser.jsx: Component is being rendered.");
    const theme = useTheme();

    // Use useMemo to safely derive colors and prevent re-calculation on every render
    const colors = useMemo(() => {
        if (!theme || !theme.palette || !theme.palette.mode) {
            console.error("DeleteUser.jsx: Theme or theme.palette.mode is undefined/null. Returning empty colors to prevent crash.", { theme });
            // Return a fallback or empty object to prevent further errors
            return { primary: {}, grey: {}, blueAccent: {}, greenAccent: {}, redAccent: {} };
        }
        const calculatedColors = tokens(theme.palette.mode);
        if (!calculatedColors || !calculatedColors.primary) {
            console.error("DeleteUser.jsx: 'tokens' function did not return expected 'primary' property. Returning empty colors.", { calculatedColors });
            return { primary: {}, grey: {}, blueAccent: {}, greenAccent: {}, redAccent: {} };
        }
        return calculatedColors;
    }, [theme]);


    // State for selected role (e.g., "student", "teacher", "admin")
    const [role, setSelectedRole] = useState("");
    // State for the user ID to be deleted via the text input
    const [userCustomId, setUserCustomId] = useState("");
    // State to store recent users fetched from the backend
    const [recentUsers, setRecentUsers] = useState([]);
    // State for loading indicator
    const [loading, setLoading] = useState(false);
    // State for success/error messages
    const [message, setMessage] = useState({ type: "", text: "" });

    // Available roles for selection (must match backend roles, e.g., "student", "teacher", "admin")
    const roles = ["student", "teacher", "admin"];

    // Function to fetch recent users based on the selected role from the backend
    const fetchRecentUsers = async (role) => {
        if (!role) {
            setRecentUsers([]); // Clear users if no role is selected
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" }); // Clear previous messages

        // Retrieve token from localStorage
        const token = localStorage.getItem("token");

        // Warn if no auth token is found
        if (!token) {
            setMessage({ type: "warning", text: "Authentication token is missing. Please log in to fetch real data." });
            setLoading(false);
            setRecentUsers([]);
            return;
        }

        try {
            console.log(`DeleteUser.jsx: Attempting GET request to /api/user-management/recent-users/${role}`);
            const response = await fetch(`${Url}/api/user-management/recent-users/${role}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Use the token from localStorage
                },
            });

            if (!response.ok) {
                let errorDetail = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetail = errorData.detail || errorDetail;
                } catch (jsonError) {
                    errorDetail = `HTTP error! status: ${response.status}. Could not parse error response.`;
                }
                throw new Error(errorDetail);
            }
            const data = await response.json();
            setRecentUsers(data); // Set the fetched users to state
            setMessage({ type: "success", text: `Successfully loaded recent ${role} users.` });
        } catch (error) {
            console.error("DeleteUser.jsx: Error fetching recent users:", error);
            setMessage({ type: "error", text: `Failed to fetch recent users: ${error.message}. Please ensure backend endpoints are correctly set up and accessible.` });
            setRecentUsers([]); // Clear users on error
        } finally {
            setLoading(false);
        }
    };

    // Effect to fetch recent users whenever the selectedRole changes
    useEffect(() => {
        fetchRecentUsers(role);
    }, [role]);

    // Handle change for role selection dropdown
    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
        setUserCustomId(""); // Clear user ID when role changes
        setMessage({ type: "", text: "" }); // Clear messages
    };

    // Handle change for user custom ID input field
    const handleUserCustomIdChange = (event) => {
        setUserCustomId(event.target.value);
    };

    // Handle delete user action (for both input field and table buttons)
    const handleDeleteUser = async (user_custom_id) => {
        if (!role) {
            setMessage({ type: "error", text: "Please select a role first." });
            return;
        }
        if (!user_custom_id) {
            setMessage({ type: "error", text: "Please enter a User ID to delete." });
            return;
        }

        // Retrieve token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage({ type: "error", text: "Authentication token is missing. Please log in to perform deletion." });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" }); // Clear previous messages

        try {
            // Frontend calls the API Gateway delete endpoint
            console.log(`DeleteUser.jsx: Attempting DELETE request to /api/user-management/delete-user/${role}/${user_custom_id}`);
            const response = await fetch(`${Url}/api/user-management/delete-user/${role}/${user_custom_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Use the token from localStorage
                },
            });

            if (!response.ok) {
                let errorDetail = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorDetail = errorData.detail || errorDetail;
                } catch (jsonError) {
                    errorDetail = `HTTP error! status: ${response.status}. Could not parse error response.`;
                }
                throw new Error(errorDetail);
            }
            const result = await response.json();
            setMessage({ type: "success", text: result.message || "User deleted successfully!" });
            fetchRecentUsers(role); // Refresh the list
            setUserCustomId(""); // Clear the input field after successful deletion
        } catch (error) {
            console.error("Error deleting user:", error);
            setMessage({ type: "error", text: `Failed to delete user: ${error.message}.` });
        } finally {
            setLoading(false);
        }
    };

    // Check if a token exists for disabling buttons
    const hasToken = !!localStorage.getItem("token");

    return (
        <Box p={4} >
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
                            {/* Role Selection Dropdown */}
                            <TextField
                                label="Select Role"
                                select
                                size="small"
                                value={role}
                                onChange={handleRoleChange}
                                sx={{ width: "48%" }}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitalize for display */}
                                    </MenuItem>
                                ))}
                            </TextField>
                            {/* User ID Input Field with Delete Button */}
                            <TextField
                                placeholder="Enter User ID to Delete"
                                size="small"
                                value={userCustomId}
                                onChange={handleUserCustomIdChange}
                                sx={{ width: "48%" }}
                            />
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: colors.redAccent[500],
                                    borderRadius: "20px",
                                    padding: "6px 16px",
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    "&:hover": {
                                        backgroundColor: colors.blueAccent[800],
                                    },
                                }}
                                onClick={() => handleDeleteUser(userCustomId)}
                                // Disable if loading, no role selected, no ID entered, or no token
                                disabled={loading || !role || !userCustomId || !hasToken}
                            >
                                Delete
                            </Button>

                        </Box>
                    </Grid>

                    {/* Loading Indicator and Message Display */}
                    

                    {/* Table Section for Recent Users */}
                    <Grid item xs={12} minWidth="1080px">
                        <Grid item xs={12} maxWidth="400px">
                        {loading && (
                            <Box display="flex" justifyContent="center" mt={2}>
                                <CircularProgress />
                            </Box>
                        )}
                        {message.text && (
                            <Alert severity={message.type} sx={{ mt: 2 }}>
                                {message.text}
                            </Alert>
                        )}
                    </Grid>
                        <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
                            Recent {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Users"}
                        </Typography>
                        <TableContainer
                            component={Paper}
                            sx={{ mt: 2, borderRadius: 2, maxHeight: 400, overflowY: "auto" }}
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
                                    {recentUsers.length > 0 ? (
                                        recentUsers.map((user) => (
                                            <TableRow key={user.id}> {/* Use user.id as key */}
                                                <TableCell>
                                                    <PersonIcon sx={{ color: colors.greenAccent[400] }} />
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
                                                            backgroundColor: colors.redAccent[500],
                                                            borderRadius: "20px",
                                                            padding: "6px 16px",
                                                            textTransform: "none",
                                                            fontWeight: "bold",
                                                            "&:hover": {
                                                                backgroundColor: colors.redAccent[700],
                                                            },
                                                        }}
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={loading || !hasToken} // Disable if loading or no token
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                {loading ? "Loading users..." : "No recent users found for this role. Select a role or log in."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default DeleteUser;