import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
  Divider,
  InputBase,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Footer from "../components/Footer";
import { tokens } from "../theme";
const Url = import.meta.env.VITE_BACKEND_URL


const ForgotPassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [step, setStep] = useState(1); // 1=email, 2=code, 3=new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });

  const handleCodeChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const updated = [...code];
      updated[index] = value;
      setCode(updated);
      if (value && index < 4) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleSendResetEmail = async () => {
    try {
      const res = await fetch(`${Url}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to send reset email");
      setStep(2);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await fetch(`${Url}/api/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: code.join(""),
        }),
      });

      if (!res.ok) throw new Error("Invalid verification code");
      setStep(3);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwords.password !== passwords.confirm) {
      return alert("Passwords do not match");
    }

    try {
      const res = await fetch$(`${Url}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          new_password: passwords.password,
        }),
      });

      if (!res.ok) throw new Error("Failed to update password");

      alert("Password updated successfully");
      setStep(1);
      setEmail("");
      setCode(["", "", "", "", ""]);
      setPasswords({ password: "", confirm: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  const renderEmailStep = () => (
    <>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Forgot Password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Please enter your email to reset the password
      </Typography>
      <Typography fontSize={14} sx={{ mb: 1 }}>
        Your Email
      </Typography>
      <TextField
        fullWidth
        placeholder="contact@dscodetech.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 4 }}
      />
      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#3B82F6",
          textTransform: "none",
          fontWeight: "bold",
          py: 1,
          "&:hover": {
            backgroundColor: "#2563eb",
          },
        }}
        onClick={handleSendResetEmail}
      >
        Reset Password
      </Button>
    </>
  );

  const renderCodeStep = () => (
    <>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Check your email
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        We sent a reset link to <strong>{email}</strong>
        <br />
        Enter 5 digit code that was mentioned in the email
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        {code.map((digit, i) => (
          <InputBase
            key={i}
            id={`code-${i}`}
            value={digit}
            onChange={(e) => handleCodeChange(i, e.target.value)}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: "center",
                fontSize: "1.5rem",
                padding: "10px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                width: "50px",
                height: "50px",
              },
            }}
          />
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#3B82F6",
          textTransform: "none",
          fontWeight: "bold",
          py: 1,
          "&:hover": {
            backgroundColor: "#2563eb",
          },
        }}
        onClick={handleVerifyCode}
      >
        Verify Code
      </Button>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Haven’t got the email yet?{" "}
        <Typography
          component="span"
          color="primary"
          sx={{ cursor: "pointer" }}
        >
          Resend email
        </Typography>
      </Typography>
    </>
  );

  const renderNewPasswordStep = () => (
    <>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Set a new password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Create a new password. Ensure it differs from previous ones for security
      </Typography>

      <Typography fontSize={14} sx={{ mb: 1 }}>
        Password
      </Typography>
      <TextField
        fullWidth
        type="password"
        placeholder="Enter your new password"
        value={passwords.password}
        onChange={(e) =>
          setPasswords({ ...passwords, password: e.target.value })
        }
        sx={{ mb: 3 }}
      />

      <Typography fontSize={14} sx={{ mb: 1 }}>
        Confirm Password
      </Typography>
      <TextField
        fullWidth
        type="password"
        placeholder="Re-enter password"
        value={passwords.confirm}
        onChange={(e) =>
          setPasswords({ ...passwords, confirm: e.target.value })
        }
        sx={{ mb: 4 }}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "#3B82F6",
          textTransform: "none",
          fontWeight: "bold",
          py: 1,
          "&:hover": {
            backgroundColor: "#2563eb",
          },
        }}
        onClick={handleUpdatePassword}
      >
        Update Password
      </Button>
    </>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#e0f2fe",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", pt: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#2563eb" }}>
          EdQuad
        </Typography>
        <Divider sx={{ borderColor: "black", mx: "auto", mt: 1 }} />
      </Box>

      {/* Center Card */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            width: "100%",
            maxWidth: 500,
            borderRadius: 2,
            position: "relative",
          }}
        >
          {/* Back Button */}
          {step > 1 && (
            <IconButton
              onClick={() => setStep((prev) => prev - 1)}
              sx={{ position: "absolute", top: 16, left: 16 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          <Box sx={{ mt: step > 1 ? 2 : 0, pl: 5, pr: 5 }}>
            {step === 1 && renderEmailStep()}
            {step === 2 && renderCodeStep()}
            {step === 3 && renderNewPasswordStep()}
          </Box>
        </Paper>
      </Box>

      <Footer />
    </Box>
  );
};

export default ForgotPassword;
