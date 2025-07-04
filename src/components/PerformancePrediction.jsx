import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { getPerformancePrediction } from "../services/modelService";
import { getPerformanceFeedback } from "../services/modelService";


import FeedbackIcon from "@mui/icons-material/Feedback";
import CloseIcon from "@mui/icons-material/Close";


const getRiskColor = (riskLevel) => {
  switch (riskLevel) {
    case "High Risk":
      return "#ef5350"; // Red
    case "Medium Risk":
      return "#ffeb3b"; // Yellow
    case "Low Risk":
      return "#81c784"; // Green
    default:
      return "#e0e0e0"; // Grey fallback
  }
};

const getTrendColor = (trend) => {
  if (trend === "Declining") return "#f44336"; // Red
  if (trend === "Improving") return "#4caf50"; // Green
  return "#000"; // Default black or neutral
};

const parseRiskLevel = (riskLevelStr) => {
  // Example input: "High Risk (Declining)"
  const mainRiskMatch = riskLevelStr.match(/^(High Risk|Medium Risk|Low Risk)/);
  const trendMatch = riskLevelStr.match(/\((.*?)\)/);

  return {
    mainRisk: mainRiskMatch ? mainRiskMatch[0] : "Unknown",
    trend: trendMatch ? trendMatch[1] : null,
  };
};


const PerformancePrediction = ({ studentId, classId }) => {
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState(null);
  const [error, setError] = useState(null);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackError, setFeedbackError] = useState(null);

  const toggleFeedback = async () => {
    if (showFeedback) {
      setShowFeedback(false);
      return;
    }

    setFeedbackLoading(true);
    setFeedbackError(null);
    try {
      const result = await getPerformanceFeedback(studentId, classId);
      setFeedbackText(result);
      setShowFeedback(true);
    } catch (err) {
      setFeedbackError(err.message);
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPerformancePrediction(studentId, classId);
        setScores(data);
      } catch (err) {
        setError(err.message || "Failed to fetch performance data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId, classId]);

  if (loading) {
    return (
      <Paper
        elevation={4}
        sx={{
          mt: 4,
          ml: 5,
          mr: 2,
          py: 5,
          px: 4,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          background: "linear-gradient(135deg, #42a5f5, #478ed1)",
          color: "#fff",
        }}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ ml: 2 }}>Calculating your scores...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={4}
        sx={{
          mt: 4,
          ml: 5,
          mr: 2,
          py: 4,
          px: 4,
          borderRadius: 4,
          backgroundColor: "#f44336",
          color: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Prediction Error
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {error}
        </Typography>
      </Paper>
    );
  }

  const { mainRisk, trend } = scores ? parseRiskLevel(scores.risk_level) : { mainRisk: "", trend: null };

  return (
    <Paper
      elevation={4}
      sx={{
        mt: 4,
        ml: 5,
        mr: 2,
        py: 5,
        px: 4,
        borderRadius: 4,
        background: "linear-gradient(to right, #43cea2, #185a9d)",
        color: "#fff",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          variant="h2"
          sx={{ mt: 1, opacity: 0.95, fontWeight: 600, fontSize: "1.1rem" }}
        >
          {trend ? (
            <span style={{ color: white, fontWeight: "bold" }}>
              {trend} Predicted performance based on recent activity
            </span>
          ) : (
            "Performance based on recent activity"
          )}
        </Typography>

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 3,
            py: 1,
            borderRadius: "24px",
            backgroundColor: getRiskColor(mainRisk),
            color: "#000",
            fontWeight: "bold",
            fontSize: "1.5rem",
            letterSpacing: "1px",
            textTransform: "uppercase",
            userSelect: "none",
            mt: 1,
          }}
        >
          {mainRisk}
          {trend === "Declining" && (
            <ArrowDownwardIcon sx={{ color: getTrendColor(trend), fontSize: 36, ml: 1 }} />
          )}
          {trend === "Improving" && (
            <ArrowUpwardIcon sx={{ color: getTrendColor(trend), fontSize: 36, ml: 1 }} />
          )}
        </Box>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              textAlign: "center",
              backgroundColor: "#ffffff22",
              p: 3,
              borderRadius: 4,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: 50, mb: 1 }} />
            <Typography variant="h6">Performance Score</Typography>
            <Box
              sx={{
                my: 2,
                width: 140,
                height: 140,
                borderRadius: "50%",
                border: "5px solid #fff",
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {scores.performance_score}%
              </Typography>
            </Box>
            <Typography variant="body2">
              Engagement via LMS, attendance, and submissions
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              textAlign: "center",
              backgroundColor: "#ffffff22",
              p: 3,
              borderRadius: 4,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <SchoolIcon sx={{ fontSize: 50, mb: 1 }} />
            <Typography variant="h6">Next Term Avg Score</Typography>
            <Box
              sx={{
                my: 2,
                width: 140,
                height: 140,
                borderRadius: "50%",
                border: "5px solid #fff",
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {scores.next_term_avg_score}
              </Typography>
            </Box>
            <Typography variant="body2">
              Predicted academic average next term
            </Typography>
          </Box>
        </Grid>
        <Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
  <Box
    component="button"
    onClick={toggleFeedback}
    sx={{
      px: 4,
      py: 1.5,
      borderRadius: "30px",
      backgroundColor: "#ffffffcc",
      color: "#0d47a1",
      fontWeight: 600,
      fontSize: "1rem",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      transition: "0.3s",
      "&:hover": {
        backgroundColor: "#ffffff",
      },
    }}
  >
    {showFeedback ? (
      <>
        <CloseIcon sx={{ fontSize: 20, mr: 1 }} />
        Hide Feedback
      </>
    ) : (
      <>
        <FeedbackIcon sx={{ fontSize: 20, mr: 1 }} />
        Show AI Feedback
      </>
    )}
  </Box>

  {feedbackLoading && (
    <Typography sx={{ mt: 2 }} color="white">
      Generating personalized advice...
    </Typography>
  )}

  {feedbackError && (
    <Typography sx={{ mt: 2 }} color="red">
      {feedbackError}
    </Typography>
  )}

  {showFeedback && feedbackText && (
    <Paper
      elevation={3}
      sx={{
        mt: 3,
        mx: "auto",
        maxWidth: "90%",
        p: 3,
        backgroundColor: "#ffffffee",
        color: "#000",
        borderRadius: 4,
        fontSize: "1rem",
        lineHeight: 1.6,
        textAlign: "left",
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Personalized Feedback from AI Advisor
      </Typography>
      <Typography variant="body1">{feedbackText}</Typography>
    </Paper>
  )}
</Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PerformancePrediction;
