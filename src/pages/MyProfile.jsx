import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  TextField,
  Paper,
  IconButton,
  Divider,
  Button,
  useTheme,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import { tokens } from "../theme";
import { StoreContext } from "../context/StoreContext";

const MyProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { name } = useContext(StoreContext);

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Saman Alvine",
    gender: "Male",
    language: "Sinhala",
    email: "alexarwles@gmail.com",
    phone: "0779603939",
    role: "Student",
    joinedDate: "2010/01/25",
    lastEditDate: "2024/04/15",
  });
  const [tempData, setTempData] = useState({ ...profileData });

  const handleChange = (field) => (event) => {
    setTempData({ ...tempData, [field]: event.target.value });
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  return (
    <Box p={4}>
      {/* Welcome */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Welcome, {name}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Tue, 07 June 2022
      </Typography>

      {/* Content Card */}
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
          <Grid  xs={12} md={2}>
            <Avatar
              src="https://randomuser.me/api/portraits/men/75.jpg"
              sx={{ width: 100, height: 100 }}
            />
          </Grid>

          <Grid  xs={12} md={10}>
            {/* Profile Fields */}
            <Grid container spacing={2}>
              <Grid  xs={12} md={4}>
                <Typography fontWeight="bold" fontSize={14}>
                  Full Name
                </Typography>
                <TextField
                  fullWidth
                  value={tempData.fullName}
                  onChange={handleChange("fullName")}
                  slotProps={{ input: { readOnly: !isEditing } }}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid  xs={12} md={4}>
                <Typography fontWeight="bold" fontSize={14}>
                  Gender
                </Typography>
                <TextField
                  fullWidth
                  value={tempData.gender}
                  onChange={handleChange("gender")}
                  slotProps={{ input: { readOnly: !isEditing } }}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid  xs={12} md={4}>
                <Typography fontWeight="bold" fontSize={14}>
                  Language
                </Typography>
                <TextField
                  fullWidth
                  value={tempData.language}
                  onChange={handleChange("language")}
                  slotProps={{ input: { readOnly: !isEditing } }}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Email & Phone Section */}
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              My email Address / Phone
            </Typography>

            <Grid container spacing={3} alignItems="center">
              <Grid >
                <IconButton color="primary">
                  <MailIcon />
                </IconButton>
              </Grid>
              <Grid  xs={10} sm={5}>
                <TextField
                  fullWidth
                  value={tempData.email}
                  onChange={handleChange("email")}
                  slotProps={{ input: { readOnly: !isEditing } }}
                  size="small"
                />
                {!isEditing && (
                  <Typography variant="caption" color="text.secondary">
                    1 month ago
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid container spacing={3} alignItems="center" sx={{ mt: 2 }}>
              <Grid >
                <IconButton color="primary">
                  <PhoneIcon />
                </IconButton>
              </Grid>
              <Grid  xs={10} sm={5}>
                <TextField
                  fullWidth
                  value={tempData.phone}
                  onChange={handleChange("phone")}
                  slotProps={{ input: { readOnly: !isEditing } }}
                  size="small"
                />
                {!isEditing && (
                  <Typography variant="caption" color="text.secondary">
                    1 month ago
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Read-only Fields */}
            <Grid container spacing={2}>
              <Grid  xs={12} md={4}>
                <Typography fontWeight="bold" fontSize={14}>
                  Role
                </Typography>
                <TextField
                  fullWidth
                  value={profileData.role}
                  slotProps={{ input: { readOnly: true } }}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid  xs={12} md={4}>
                <Typography fontWeight="bold" fontSize={14}>
                  Joined Date
                </Typography>
                <TextField
                  fullWidth
                  value={profileData.joinedDate}
                  slotProps={{ input: { readOnly: true } }}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid  xs={12} md={4}>
                <Typography fontWeight="bold" fontSize={14}>
                  Last edit date
                </Typography>
                <TextField
                  fullWidth
                  value={profileData.lastEditDate}
                  slotProps={{ input: { readOnly: true } }}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>

            {/* Buttons */}
            <Box mt={4}>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: "none", fontWeight: "bold", mr: 2 }}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    sx={{ textTransform: "none" }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: "none", fontWeight: "bold" }}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MyProfile;
