// import React from "react";
// import { Box, Typography, Grid } from "@mui/material";
// import SubjectProgress from "../components/SubjectProgress";
// import AssignmentTimeline from "../components/AssignmentTimeline";
// import AttendanceOverview from "../components/AttendanceOverview";
// import AcademicPerformance from "../components/AcademicPerformance";
// import PerformancePrediction from "../components/PerformancePrediction";
// import Calendar from "../components/Calendar";

// const StudentDashboard = () => {
//   return (
//     <Box p={4} sx={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         Student Dashboard
//       </Typography>

//       <Grid container spacing={3}>
//         {/* Subject Progress */}
//         <Grid item xs={12}>
//           <SubjectProgress />
//         </Grid>

//         {/* Assignment Timeline */}
//         <Grid item xs={12}>
//           <AssignmentTimeline />
//         </Grid>

//         {/* Attendance Overview */}
//         <Grid item xs={12}>
//           <AttendanceOverview />
//         </Grid>

//         {/* Academic Performance */}
//         <Grid item xs={12}>
//           <AcademicPerformance />
//         </Grid>

//         {/* Performance Prediction */}
//         <Grid item xs={12}>
//           <PerformancePrediction />
//         </Grid>

//         {/* Calendar */}
//         <Grid item xs={12}>
//           <Calendar />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default StudentDashboard;


import React from "react";
import SubjectProgress from "../components/SubjectProgress";
import AssignmentTimeline from "../components/AssignmentTimeline";
import StudentExamMarksChart from "../components/AcademicPerformance";
import AttendanceOverview from "../components/AttendanceOverview";
import Calendar from "../components/Calendar";

const StudentDashboard = () => {

  const studentId = 'STU009';
  const classId = 'CLS002';

  console.log("Dashboard is rendering...");

  return (
    <div className="p-6 space-y-8" >
      <SubjectProgress studentId={studentId} classId={classId} />
      <AssignmentTimeline studentId= 'STU001' classId= 'CLS001' />
      <AttendanceOverview studentId='STU030' classId='CLS013' />
      <StudentExamMarksChart studentId='STU001' classId='CLS001' examYear = "2024" />
      <Calendar />
    </div>
    
  );
  
};

export default StudentDashboard;
