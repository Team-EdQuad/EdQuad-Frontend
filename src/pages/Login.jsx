import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  useTheme,
  InputAdornment,
  IconButton,
  Link,
  rgbToHex,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { StoreContext } from "../context/StoreContext";
import Footer from "../components/Footer";
import { tokens } from "../theme";
import bgImage from "../assets/login-bg.png";
import Image from "../assets/123.png";
import Image2 from "../assets/456.jpeg"
import { useNavigate } from "react-router-dom";
const Url = import.meta.env.VITE_BACKEND_URL

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}


const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { setRole } = useContext(StoreContext);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    try {
      // 1. Login request
      // const response = await fetch("http://"+{user_managemnent}+"/api/user-management/login/", {

      const response = await fetch(`${Url}/api/user-management/login/`, {
      method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      // 2. Fetch profile using token from login response
      // const profileResponse = await fetch("http://localhost:8000/api/user-management/profile", {
      const profileResponse = await fetch(`${Url}/api/user-management/profile`, {
      
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch profile");
      }

      const profile = await profileResponse.json();

      // 3. Store token and profile data in context and localStorage
      const loginData = {
        token: data.access_token,
        role: profile.role,
        id: profile.user_id|| profile.teacher_id || profile.student_id || profile.admin_id ,
        name: profile.full_name || profile.name || "",
        classId: profile.class_id || null, // add this to StoreContext
        email: profile.email, 
      };

      console.log("Login data:", loginData);
      login(loginData);

      navigate("/dashboard");
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${Image})`,
        backgroundSize: "contain",
        backgroundPosition: "left",
        // backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          px: 2,
          pl: { xs: 2, sm: 6, md: 12 },
          opacity: 1,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4, mt:12,
            width: "100%",
            maxWidth: 500,
            borderRadius: 4,
            background: "rgba(43, 51, 62, 0.97)", // more solid white for contrast
            boxShadow: "0 8px 32px rgba(127, 72, 72, 0.18)",
            // justifyContent: "center",
          }}
        >
          {/* <Typography
            variant="h6"
            fontWeight="bold"
            color="text.secondary"
            sx={{
              mb: 1,
              fontFamily: '"Open Sans", "Nunito", "Quicksand", sans-serif',
              fontSize: 12,
              letterSpacing: 0.5,
            }}
          >
            EdQuad
          </Typography> */}
          <Typography sx={{ fontSize: '28px', fontWeight: 600, color: "rgba(255, 255, 255, 0.95)", mb: 2, textAlign: "center" }}>
            Ed<span style={{ color: 'rgb(97, 109, 171)' }}>Q</span>uad
          </Typography>

          <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 , textAlign: "center", color: "rgb(118, 135, 140)", }}>
            Login
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="Email" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="off"
            InputLabelProps={{
              sx: { color: "rgb(255,255,255)" } // Label color
            }}
            InputProps={{
              sx: {
                color: "#fff", // Input text color
                "& input::placeholder": {
                  color: "#fff", // Placeholder color
                  opacity: 1
                }
              }
            }}
          />
          <TextField 
            fullWidth
            margin="normal"
            label="Password"
            name="password"  
            type={showPassword ? "text" : "password" }
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton sx={{ color: "#fff" }}
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                color: "#fff", // Input text color
                "& input::placeholder": {
                  color: "#fff", // Placeholder color
                  opacity: 1
                }
              }
            }}
            InputLabelProps={{
              sx: { color: "rgb(255,255,255)" } // Label color
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 1,
              mb: 2,
            }}
          >
            <Link
              href="/forgot-password"
              underline="hover"
              fontSize={13}
              fontWeight="400"
              color="white"
            >
              Forgot Password?
            </Link>
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="error"
            sx={{ textTransform: "none", fontWeight: "bold", py: 1 }}
            onClick={handleLogin}
          >
            Sign in
          </Button>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 4, color: "ButtonHighlight" }}
          >
            Don't have an account yet?
          </Typography>
        </Paper>
      </Box>

      {/* <Footer /> */}
    </Box>
  );
};

export default Login;
