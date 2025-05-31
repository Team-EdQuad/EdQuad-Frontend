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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { StoreContext } from "../context/StoreContext";
import Footer from "../components/Footer";
import { tokens } from "../theme";
import bgImage from "../assets/login-bg.png";

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { setRole } = useContext(StoreContext);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = () => {
    if (formData.username === "student") {
      setRole("Student");
    } else if (formData.username === "teacher") {
      setRole("Teacher");
    } else if (formData.username === "admin") {
      setRole("Admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "left",
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
            p: 4,
            width: "100%",
            maxWidth: 380,
            borderRadius: 4,
            background: "linear-gradient(to bottom, #dbeafe, #bfdbfe)",
            opacity: 1,
          }}
        >
          <Typography
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
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
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
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
            inputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
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
              fontSize={14}
              fontWeight="500"
              color="primary"
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
            sx={{ mt: 4, color: "text.secondary" }}
          >
            Don't have an account yet?
          </Typography>
        </Paper>
      </Box>

      <Footer />
    </Box>
  );
};

export default Login;
