import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { StoreContext } from "./context/StoreContext";
import { useContext } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

// Pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import MyProfile from "./pages/MyProfile";
import AddTeacher from "./pages/AddTeacher";
import AddStudent from "./pages/AddStudent";
import UpdateUser from "./pages/UpdateUser";
import DeleteUser from "./pages/DeleteUser";
import StudentCalendar from "./pages/StudentCalendar";
import Calendar from "./pages/Calendar";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDasboard";
import Sports from "./pages/Sports";
import UnderConstruction from "./pages/UnderConstruction";
import Clubandsocieties from "./pages/Clubandsocieties";
import Dashboard from "./pages/Dashboard";
import AssignmentMarks from "./pages/AssignmentMarks";
import AssignmentView from "./pages/AssignmentView";
import TermTestMarks from "./pages/TermTestMarks";
import MySubject from "./pages/MySubject";
import SubjectContent from "./pages/SubjectContent";
import Submission from "./pages/Submission";
import TeacherSubject from "./pages/TeacherSubject";
import TeacherContent from "./pages/TeacherContent";
import AssignmentCreate from "./pages/AssignmentCreate";
import AddContent from "./pages/AddContent";
import CheckAssignment from "./pages/CheckAssignment";
import AddExamMarks from "./pages/AddExamMarks";
import ContentView from "./pages/ContentView";
import BehavioralAnalysis from "./pages/BehavioralAnalysis";
import AssignmentFileView from "./pages/AssignmentFileView";
import SubmissionView from "./pages/SubmissionView";

import TeacherAnalysis from "./pages/Attendance-Module/Teacher-Analysis";
import StudentAnalysis from "./pages/Attendance-Module/Student-Analysis";
import TeacherAttendanceEntry from "./pages/Attendance-Module/Teacher-AttendanceEntry";
import StudentDocument from "./pages/Attendance-Module/Student-Document";
import TeacherDocument from "./pages/Attendance-Module/Teacher-Document";

function Layout() {
  const [theme, colorMode] = useMode();
  const { isMobile, role: userRole } = useContext(StoreContext);

  const studentRoutes = (
    <>
      <Route path="/" element={<StudentDashboard />} />
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/sports" element={<Sports />} />
      <Route path="/clubandsocieties" element={<Clubandsocieties />} />
      <Route path="/calender" element={<StudentCalendar />} />
      <Route path="/termtestmarks" element={<TermTestMarks />} />
      <Route path="/mysubject" element={<MySubject />} />
      <Route path="/assigmentsmarks" element={<AssignmentMarks />} />
      <Route path="/subject/:subjectId" element={<SubjectContent />} />
      <Route
        path="/assignment-view/:assignmentId"
        element={<AssignmentView />}
      />
      <Route path="/submission/:assignment_id" element={<Submission />} />
      <Route path="/content-view/:contentId" element={<ContentView />} />

      <Route
        path="/student/attendance/analysis"
        element={<StudentAnalysis />}
      />
      <Route
        path="/student/attendance/document"
        element={<StudentDocument studentId="STD001" classId="CLS008" />}
      />
      <Route path="/assignment-file-view" element={<AssignmentFileView />} />
      <Route path="/uc" element={<UnderConstruction />} />
      <Route path="*" element={<Navigate to="/uc" />} />
    </>
  );

  const teacherRoutes = (
    <>
      <Route path="/" element={<TeacherDashboard />} />
      <Route path="/dashboard" element={<TeacherDashboard />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/sports" element={<Sports />} />
      <Route path="/clubandsocieties" element={<Clubandsocieties />} />
      <Route path="/calender" element={<Calendar />} />
      <Route path="/academic" element={<TeacherSubject />} />
      <Route path="/teacher-content" element={<TeacherContent />} />
      <Route path="/assignment-create" element={<AssignmentCreate />} />
      <Route path="/add-content" element={<AddContent />} />
      <Route path="/check-assignments" element={<CheckAssignment />} />
      <Route path="/enter-term-test-marks" element={<AddExamMarks />} />
      <Route path="/attendance/entry" element={<TeacherAttendanceEntry />} />
      <Route path="/attendance/analysis" element={<TeacherAnalysis />} />
      <Route path="/attendance/document" element={<TeacherDocument />} />
      <Route path="/uc" element={<UnderConstruction />} />
      <Route path="/behavioural-analysis" element={<BehavioralAnalysis />} />
      <Route path="/submission/view/:submissionId" element={<SubmissionView />} />  
      <Route path="*" element={<Navigate to="/uc" />} />
    </>
  );

  // Admin Routes
  const adminRoutes = (
    <>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/add-teacher" element={<AddTeacher />} />
      <Route path="/add-student" element={<AddStudent />} />
      <Route path="/update-user" element={<UpdateUser />} />
      <Route path="/delete-user" element={<DeleteUser />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/calender" element={<Calendar />} />
      <Route path="/sports" element={<Sports />} />
      <Route path="/academic" element={<TeacherSubject />} />
      <Route path="/clubandsocieties" element={<Clubandsocieties />} />
      <Route path="/uc" element={<UnderConstruction />} />
      <Route path="*" element={<Navigate to="/uc" />} />
    </>
  );

  // const getRoutes = () => {
  //   switch (userRole) {
  //     case "Student":
  //       return studentRoutes;
  //     case "Teacher":
  //       return teacherRoutes;
  //     case "Admin":
  //       return adminRoutes;
  //     default:
  //       return (
  //         <Routes>
  //           <Route path="/" element={<Login />} />
  //           <Route path="*" element={<Navigate to="/" />} />
  //         </Routes>
  //       );
  //   }
  // };

  const getRoutes = () => {
  switch (userRole) {
    case "student":
      return studentRoutes; // array of <Route> elements
    case "teacher":
      return teacherRoutes;
    case "admin":
      return adminRoutes;
    default:
      return [
        <Route key="login" path="/" element={<Login />} />,
        <Route key="notfound" path="*" element={<Navigate to="/" />} />
      ];
  }
};


  return (
    <>
      <CssBaseline />
      <div className="panel">
        <div className="top-panel">
          <Topbar />
        </div>
        <div className="bottom-panel">
          <div className="bottom-left-panel">
            {!isMobile && <Sidebar role={userRole} />}
          </div>
          <div className="bottom-right-panel">
            <main className="content">
              <Routes>{getRoutes()}</Routes>
            </main>

            <div className="footer">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>

    // <ColorModeContext.Provider value={colorMode}>
    //   <ThemeProvider theme={theme}>
    //     <CssBaseline />
    //     <div className="panel">
    //       <div className="top-panel">
    //         <Topbar />
    //       </div>
    //       <div className="bottom-panel">
    //         <div className="bottom-left-panel">
    //           {!isMobile && <Sidebar role={userRole} />}
    //         </div>
    //         <div className="bottom-right-panel">
    //           <main className="content">{getRoutes()}</main>
    //           <div className="footer">
    //             <Footer />
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </ThemeProvider>
    // </ColorModeContext.Provider>
  );
}

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/*" element={<Layout />} />
        </Routes> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
