import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Link,
  Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{
        background: "linear-gradient(120deg, #e3f0fc 0%, #b3d8fa 100%)",
      }}
    >
      {/* Main Content */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flex={1}
        py={6}
      >
        <Box
          display="flex"
          alignItems="center"
          width="80vw"
          maxWidth="1100px"
          bgcolor="transparent"
          borderRadius={6}
          boxShadow={0}
        >
          {/* Login Form */}
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              minWidth: 350,
              maxWidth: 370,
              mr: 6,
              bgcolor: "rgba(255,255,255,0.7)",
            }}
          >
            <Typography variant="h5" fontWeight="bold" mb={2}>
              EdQuad
            </Typography>
            <Typography variant="h4" fontWeight="bold" mb={3}>
              Login
            </Typography>
            <TextField
              label="Email"
              placeholder="username@gmail.com"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
            />
            <TextField
              label="Password"
              placeholder="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Link href="#" underline="hover" fontSize={14}>
                Forgot Password?
              </Link>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#f4511e",
                color: "#fff",
                fontWeight: "bold",
                py: 1.2,
                mb: 2,
                "&:hover": { bgcolor: "#d84315" },
              }}
            >
              Sign in
            </Button>
            <Typography variant="body2" align="center" color="text.secondary">
              Don&apos;t have an account yet?
            </Typography>
          </Paper>

          {/* Illustration */}
          <Box flex={1} display="flex" justifyContent="center" alignItems="center">
            <img
              src="https://www.cpjobs.com/hk/sites/default/files/styles/large/public/photos/content/855x420_jp_edu_20180515.gif?itok=1QTR0iz6"
              alt="EdQuad Illustration"
              style={{ maxWidth: "420px", width: "100%" }}
            />
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        width="100%"
        bgcolor="#a4bfcf"
        py={3}
        px={2}
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        sx={{ borderTop: "4px solid #e0e0e0" }}
      >
        <Box mb={{ xs: 2, md: 0 }}>
          <Typography fontWeight="bold" mb={1}>
            Contact Us
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <span>✉️</span>
            <span>📞</span>
            <span>📱</span>
          </Box>
          <Typography fontWeight="bold" mb={1}>
            Follow Us
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <span>📘</span>
            <span>🔗</span>
            <span>💼</span>
          </Box>
        </Box>
        <Box>
          <Typography fontWeight="bold" mb={1}>
            Quick Links
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Contact site support</li>
            <li>Help Center</li>
            <li>Student Handbook</li>
            <li>Academic Calendar</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;