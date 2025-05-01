import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Chip } from "@mui/material";

const assignments = [
  { title: "Report Submission", subject: "Science", date: "20-02-2025", status: "Completed" },
  { title: "Take Home Assignment", subject: "Geography", date: "22-02-2025", status: "Upcoming" },
  { title: "Quiz", subject: "History", date: "30-02-2025", status: "Upcoming" },
  { title: "Take Home Assignment", subject: "Health", date: "27-03-2025", status: "Upcoming" },
];

const AssignmentTimeline = () => {
  return (
    <Box p={3} sx={{ backgroundColor: "#fff", borderRadius: "8px" }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Assignment Timeline
      </Typography>
      <List>
        {assignments.map((assignment, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={`${assignment.title} - ${assignment.subject}`}
              secondary={assignment.date}
            />
            <Chip
              label={assignment.status}
              color={assignment.status === "Completed" ? "success" : "warning"}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AssignmentTimeline;