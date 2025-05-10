import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper, LinearProgress, Avatar } from "@mui/material";
import { getTeacherAssignmentsDashboard } from "../services/teacherDService"; 
import AssignmentIcon from "@mui/icons-material/Assignment";

const CourseMaterialProgress = ({ teacherId }) => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getTeacherAssignmentsDashboard(teacherId);
        setAssignments(data);
      } catch (error) {
        console.error("Failed to load assignments", error);
      }
    };
    fetchAssignments();
  }, [teacherId]);

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 1, mt: 4, ml: 5, mr: 2, width:'65%'}}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, pb: 1 }}>
        <Typography variant="h4" fontWeight={600}>
          Course Material Progress
        </Typography>
      </Box>

      <Grid container direction="column" spacing={2} sx={{ maxHeight: 250, overflowY: "auto", overflowX: "hidden", p:"inherit", minWidth: '100%', flexWrap: 'nowrap' }}>

        {assignments.map((item, index) => {
          const progress = item.total_students > 0
            ? (item.submission_count / item.total_students) * 100
            : 0;

          return (
            <Grid item key={index}>
                <Paper elevation={3} sx={{ display: "flex", alignItems: "center", p: 1, borderRadius: 1, minWidth: 100, width: "100%",}}>

                <Avatar sx={{ bgcolor: "#2196f3", mr: 2 }}>
                  <AssignmentIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={600}>{item.assignment_name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.class_name}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 100, textAlign: "center" }}>
                  <Typography>{new Date(item.deadline).toLocaleDateString("en-GB")}</Typography>
                </Box>
                <Box sx={{ minWidth: 120, textAlign: "right" }}>
                  <Typography sx={{ color: "blue", fontWeight: 500 }}>
                    {item.submission_count}/{item.total_students}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default CourseMaterialProgress;
