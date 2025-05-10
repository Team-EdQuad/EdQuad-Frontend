import React, { useState, useEffect } from "react";
import {
  getStudentAssignments,
  getFilteredAssignments,
  getSortedAssignments,
} from "../services/studentDService";
import dayjs from "dayjs";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import {
  List,
  ListItem,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

const AssignmentTimeline = ({ studentId, classId }) => {
  const [assignments, setAssignments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortByDate, setSortByDate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        if (sortByDate) {
          data = await getSortedAssignments(
            studentId,
            classId,
            statusFilter !== "All" ? statusFilter : null
          );
        } else if (statusFilter !== "All") {
          data = await getFilteredAssignments(studentId, classId, statusFilter);
        } else {
          data = await getStudentAssignments(studentId, classId);
        }
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchData();
  }, [studentId, classId, statusFilter, sortByDate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success.main";
      case "Upcoming":
        return "info.main";
      case "Overdue":
        return "error.main";
      default:
        return "text.secondary";
    }
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: 1, bgcolor: "corn", mt: 4, boxShadow: 3, mr: 2, ml: 5 , pb:2}}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
        <Typography variant="h4" fontWeight="bold">
          Assignment Timeline
        </Typography>
      </Box>

      {/* Filter Controls */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, gap: 2  }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Upcoming">Upcoming</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", alignItems: "center", border: 1, borderColor: "divider", borderRadius: 1 }}>
          <Typography variant="body2" sx={{ px: 1.5, color: "text.secondary" }}>
            Sort By Date
          </Typography>
          <Select
            value={sortByDate ? "Yes" : "No"}
            onChange={(e) => setSortByDate(e.target.value === "Yes")}
            size="small"
            sx={{ 
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              borderLeft: 1, 
              borderColor: "divider",
              minWidth: 70
            }}
          >
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Assignment List */}
     
      {assignments.length === 0 ? (
        <Box sx={{ p: 2 }}>
          <Typography>No assignments available.</Typography>
        </Box >
      ) : (
        <Box px={2} >
        <List disablePadding sx={{ maxHeight: 320, overflowY: "auto" ,p:"inherit", }}>
          {assignments.map((assignment, index) => (
            <React.Fragment key={index}>
             <ListItem onClick={() => window.location.href = `/assignment/${assignment.assignment_id}`}
                sx={{
                  mb: 1,
                  px: 8,
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between", 
                  "&:hover": { bgcolor: "action.hover" },
                  boxShadow: 3,
                  bgcolor: "white",
                }}
              >
                {/* Left: Assignment Name + Subject */}
                <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <DescriptionIcon sx={{ mr: 2, color: "blue" }} />
                  <Box>
                    <Typography fontWeight="bold">{assignment.assignment_name}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      {assignment.subject_name}
                    </Typography>
                  </Box>
                </Box>

                {/* Center: Deadline */}
                <Box sx={{ flex: 1, textAlign: "center" }}>
                  <Typography variant="body1">
                    {assignment.deadline
                      ? dayjs(assignment.deadline).format("DD-MM-YYYY")
                      : "No Deadline"}
                  </Typography>
                </Box>

                {/* Right: Status */}
                <Box sx={{ flex: 1, textAlign: "right" }}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ color: getStatusColor(assignment.status) }}
                  >
                    {assignment.status === "Upcoming" ? "Up Coming" : assignment.status}
                  </Typography>
                </Box>
              </ListItem>
              {index < assignments.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List></Box>
      )}
    </Paper>
  );
};

export default AssignmentTimeline;
