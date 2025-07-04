// import React, { useContext, useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Avatar,
//   Grid,
//   TextField,
//   Paper,
//   IconButton,
//   Divider,
//   Button,
//   useTheme,
//   Stack,
// } from "@mui/material";
// import MailIcon from "@mui/icons-material/Mail";
// import PhoneIcon from "@mui/icons-material/Phone";
// import { tokens } from "../theme";
// import { StoreContext } from "../context/StoreContext";

// const MyProfile = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const { token, name } = useContext(StoreContext);

//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState(null);
//   const [tempData, setTempData] = useState({});

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch("http://127.0.0.1:8000/api/user-management/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!response.ok) throw new Error("Failed to fetch profile");
//         const data = await response.json();
//         setProfileData(data);
//         setTempData(data);
//       } catch (err) {
//         console.error("Error loading profile:", err.message);
//       }
//     };
//     fetchProfile();
//   }, [token]);

//   const handleChange = (field) => (e) => {
//     setTempData({ ...tempData, [field]: e.target.value });
//   };

//   const handleSave = () => {
//     setProfileData({ ...tempData });
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setTempData({ ...profileData });
//     setIsEditing(false);
//   };

//   if (!profileData) return <Typography>Loading profile...</Typography>;

//   return (
//     <Box p={4}>
//       <Typography variant="h5" fontWeight="bold" gutterBottom>
//         Welcome, {name || profileData.full_name}
//       </Typography>
//       <Typography variant="body2" color="text.secondary" gutterBottom>
//         {new Date().toLocaleDateString("en-US", {
//           weekday: "short",
//           day: "numeric",
//           month: "long",
//           year: "numeric",
//         })}
//       </Typography>

//       <Paper
//         elevation={4}
//         sx={{
//           mt: 4,
//           borderRadius: 4,
//           p: { xs: 3, md: 5 },
//           background: colors.primary[400],
//           backdropFilter: "blur(10px)",
//         }}
//       >
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={3}>
//             <Avatar
//               src="https://randomuser.me/api/portraits/men/75.jpg"
//               sx={{
//                 width: 120,
//                 height: 120,
//                 boxShadow: 3,
                
//               }}
//             />
//           </Grid>

//           <Grid item xs={12} md={9}>
//             <Grid container spacing={3}>
//               {["full_name", "gender", "language"].map((field, i) => (
//                 <Grid item xs={12} md={4} key={field}>
//                   <Typography fontWeight={500} fontSize={14} mb={1}>
//                     {field === "full_name"
//                       ? "Full Name"
//                       : field.charAt(0).toUpperCase() + field.slice(1)}
//                   </Typography>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     value={tempData[field] || ""}
//                     onChange={handleChange(field)}
//                     size="small"
//                     InputProps={{ readOnly: !isEditing }}
//                     sx={{
//                       borderRadius: 2,
//                       backgroundColor: theme.palette.background.paper,
//                     }}
//                   />
//                 </Grid>
//               ))}
//             </Grid>

//             <Divider sx={{ my: 4 }} />

//             <Typography variant="subtitle1" fontWeight={600} gutterBottom>
//               Contact Details
//             </Typography>
//             <Stack direction="row" spacing={2} alignItems="center" mb={2}>
//               <IconButton color="primary">
//                 <MailIcon />
//               </IconButton>
//               <TextField
//                 fullWidth
//                 value={tempData.email || ""}
//                 onChange={handleChange("email")}
//                 size="small"
//                 InputProps={{ readOnly: !isEditing }}
//                 sx={{backgroundColor: theme.palette.background.paper,}}
//               />
//             </Stack>

//             <Stack direction="row" spacing={2} alignItems="center" mb={2}>
//               <IconButton color="primary">
//                 <PhoneIcon />
//               </IconButton>
//               <TextField
//                 fullWidth
//                 value={tempData.phone || ""}
//                 onChange={handleChange("phone")}
//                 size="small"
//                 InputProps={{ readOnly: !isEditing }}
//                 sx={{backgroundColor: theme.palette.background.paper,}}
//               />
//             </Stack>

//             <Divider sx={{ my: 4 }} />

//             <Grid container spacing={3}>
//               <Grid item xs={12} md={4}>
//                 <Typography fontWeight={500} fontSize={14}>
//                   Role
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   value={profileData.role}
//                   inputProps={{ readOnly: true }}
//                   sx={{ mt: 1, backgroundColor: theme.palette.background.paper}}
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <Typography fontWeight={500} fontSize={14}>
//                   Joined Date
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   value={profileData.join_date || "-"}
//                   inputProps={{ readOnly: true }}
//                   sx={{ mt: 1, backgroundColor: theme.palette.background.paper}}
                  
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <Typography fontWeight={500} fontSize={14}>
//                   Last Edit Date
//                 </Typography>
//                 <TextField
//                   fullWidth
//                   size="small"
//                   value={profileData.last_edit_date || "-"}
//                   inputProps={{ readOnly: true }}
//                   sx={{ mt: 1, backgroundColor: theme.palette.background.paper}}
//                 />
//               </Grid>
//             </Grid>

//             <Stack direction="row" spacing={2} mt={4}>
//               {isEditing ? (
//                 <>
//                   <Button variant="contained" onClick={handleSave}>
//                     Save
//                   </Button>
//                   <Button variant="outlined" onClick={handleCancel}>
//                     Cancel
//                   </Button>
//                 </>
//               ) : (
//                 <Button variant="contained" onClick={() => setIsEditing(true)}>
//                   Edit
//                 </Button>
//               )}
//             </Stack>
//           </Grid>
//         </Grid>
//       </Paper>
//     </Box>
//   );
// };

// export default MyProfile;


import React, { useContext, useEffect, useState, useRef } from "react"; // Import useRef
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
  Stack,
  CircularProgress, // For loading indicator
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"; // Camera icon for upload
import EditIcon from "@mui/icons-material/Edit"; // Edit icon
import SaveIcon from "@mui/icons-material/Save"; // Save icon
import CancelIcon from "@mui/icons-material/Cancel"; // Cancel icon
import { tokens } from "../theme";
import { StoreContext } from "../context/StoreContext";

const MyProfile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token, name } = useContext(StoreContext);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [tempData, setTempData] = useState({});
  const [profileImage, setProfileImage] = useState(null); // State for the selected file object
  const [profileImageUrl, setProfileImageUrl] = useState("https://randomuser.me/api/portraits/men/75.jpg"); // State for the image URL (local or fetched)
  const [uploading, setUploading] = useState(false); // State for upload loading
  const fileInputRef = useRef(null); // Ref for hidden file input

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user-management/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfileData(data);
        setTempData(data);
        // Assuming your profile data might include a profile_picture URL
        if (data.profile_picture) {
          setProfileImageUrl(data.profile_picture);
        }
      } catch (err) {
        console.error("Error loading profile:", err.message);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (field) => (e) => {
    setTempData({ ...tempData, [field]: e.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create a local URL for preview
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setUploading(true);
    let updatedProfileData = { ...tempData };

    // Handle image upload if a new file is selected
    if (profileImage) {
      const formData = new FormData();
      formData.append("profile_picture", profileImage);

      try {
        const uploadResponse = await fetch("http://127.0.0.1:8000/api/user-management/upload-profile-picture", { // Adjust this API endpoint
          method: "POST", // Or PUT, depending on your backend
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data' is NOT needed; browser sets it with FormData
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload profile picture");
        }
        const uploadData = await uploadResponse.json();
        // Assuming your upload API returns the new URL of the picture
        updatedProfileData.profile_picture = uploadData.profile_picture_url; // Adjust key as per your API response
        setProfileImageUrl(uploadData.profile_picture_url); // Update permanent URL
        setProfileImage(null); // Clear the selected file after upload
      } catch (err) {
        console.error("Error uploading profile picture:", err.message);
        setUploading(false);
        // You might want to show an error message to the user
        return; // Prevent saving other data if image upload failed
      }
    }

    // Now save other profile data
    try {
      const saveResponse = await fetch("http://127.0.0.1:8000/api/user-management/profile", { // Adjust this API endpoint for profile update
        method: "PUT", // Or PATCH
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfileData),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save profile data");
      }

      const savedData = await saveResponse.json();
      setProfileData(savedData);
      setTempData(savedData);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile data:", err.message);
      // Show error to user
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    // Revert profile image if it was changed
    if (profileData.profile_picture) {
      setProfileImageUrl(profileData.profile_picture);
    } else {
      setProfileImageUrl("https://randomuser.me/api/portraits/men/75.jpg"); // Default if no picture
    }
    setProfileImage(null);
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the hidden file input click
    }
  };

  if (!profileData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
        <Typography variant="h6" ml={2}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Welcome, {name || profileData.full_name}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {new Date().toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Typography>

      <Paper
        elevation={4}
        sx={{
          mt: 4,
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          background: colors.primary[400],
          backdropFilter: "blur(10px)",
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={3} sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Avatar
              src={profileImageUrl} // Use profileImageUrl for display
              sx={{
                width: 120,
                height: 120,
                boxShadow: 5,
                cursor: isEditing ? 'pointer' : 'default', // Make avatar clickable in edit mode
              }}
              onClick={handleAvatarClick}
            />
            {isEditing && (
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8, // Adjust as needed to position over the avatar
                  backgroundColor: colors.primary[500],
                  '&:hover': {
                    backgroundColor: colors.primary[600],
                  },
                }}
                color="inherit" // Use inherit or primary
                onClick={handleAvatarClick}
                size="small"
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }} // Hide the actual input
              onChange={handleFileChange}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {["full_name", "gender", "language"].map((field, i) => (
                <Grid item xs={12} md={4} key={field}>
                  <Typography fontWeight={500} fontSize={14} mb={1}>
                    {field === "full_name"
                      ? "Full Name"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={tempData[field] || ""}
                    onChange={handleChange(field)}
                    size="small"
                    InputProps={{ readOnly: !isEditing }}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.paper,
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Contact Details
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <IconButton color="primary">
                <MailIcon />
              </IconButton>
              <TextField
                fullWidth
                value={tempData.email || ""}
                onChange={handleChange("email")}
                size="small"
                InputProps={{ readOnly: !isEditing }}
                sx={{backgroundColor: theme.palette.background.paper,}}
              />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <IconButton color="primary">
                <PhoneIcon />
              </IconButton>
              <TextField
                fullWidth
                value={tempData.phone || ""}
                onChange={handleChange("phone")}
                size="small"
                InputProps={{ readOnly: !isEditing }}
                sx={{backgroundColor: theme.palette.background.paper,}}
              />
            </Stack>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography fontWeight={500} fontSize={14}>
                  Role
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={profileData.role}
                  inputProps={{ readOnly: true }}
                  sx={{ mt: 1, backgroundColor: theme.palette.background.paper}}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography fontWeight={500} fontSize={14}>
                  Joined Date
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={profileData.join_date || "-"}
                  inputProps={{ readOnly: true }}
                  sx={{ mt: 1, backgroundColor: theme.palette.background.paper}}

                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography fontWeight={500} fontSize={14}>
                  Last Edit Date
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={profileData.last_edit_date || "-"}
                  inputProps={{ readOnly: true }}
                  sx={{ mt: 1, backgroundColor: theme.palette.background.paper}}
                />
              </Grid>
            </Grid>

            <Stack direction="row" spacing={2} mt={4}>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={uploading} // Disable during upload/save
                    startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  >
                    {uploading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outlined" onClick={handleCancel} startIcon={<CancelIcon />}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={() => setIsEditing(true)} startIcon={<EditIcon />}>
                  Edit Profile
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MyProfile;