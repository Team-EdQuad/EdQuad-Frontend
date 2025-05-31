import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { Routes, Route, Navigate } from "react-router-dom";
import { StoreContext } from "./context/StoreContext";
import { useContext } from "react";

// Pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import MyProfile from "./pages/MyProfile";
import AddTeacher from "./pages/AddTeacher";
import AddStudent from "./pages/AddStudent";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDasboard";
import Sports from "./pages/Sports";
import Clubandsocieties from "./pages/Clubandsocieties";
import TermTestMarks from "./pages/TermTestMarks";
import MySubject from "./pages/MySubject";
import AssignmentMarks from "./pages/AssignmentMarks";
import AssignmentView from "./pages/AssignmentView";
import Submission from "./pages/Submission";
import SubjectContent from "./pages/SubjectContent";
import TeacherSubject from "./pages/TeacherSubject";
import TeacherContent from "./pages/TeacherContent";
import AssignmentCreate from "./pages/AssignmentCreate";
import AddContent from "./pages/AddContent";
import CheckAssignment from "./pages/CheckAssignment";
import AddExamMarks from "./pages/AddExamMarks";
import ContentView from "./pages/ContentView";
import BehavioralAnalysis from "./pages/BehavioralAnalysis";
import AssignmentFileView from "./pages/AssignmentFileView";
import UnderConstruction from "./pages/UnderConstruction";

function Layout() {
  const { isMobile, role: userRole } = useContext(StoreContext);

  const studentRoutes = (
    <>
      <Route path="/" element={<StudentDashboard />} />
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/sports" element={<Sports />} />
      <Route path="/clubandsocieties" element={<Clubandsocieties />} />
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
      <Route path="/academic" element={<TeacherSubject />} />
      <Route path="/teacher-content" element={<TeacherContent />} />
      <Route path="/assignment-create" element={<AssignmentCreate />} />
      <Route path="/add-content" element={<AddContent />} />
      <Route path="/check-assignments" element={<CheckAssignment />} />
      <Route path="/enter-term-test-marks" element={<AddExamMarks />} />
      <Route path="/behavioural-analysis" element={<BehavioralAnalysis />} />
      <Route path="/uc" element={<UnderConstruction />} />
      <Route path="*" element={<Navigate to="/uc" />} />
    </>
  );

  const adminRoutes = (
    <>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/add-teacher" element={<AddTeacher />} />
      <Route path="/add-student" element={<AddStudent />} />
      <Route path="/sports" element={<Sports />} />
      <Route path="/clubandsocieties" element={<Clubandsocieties />} />
      <Route path="/uc" element={<UnderConstruction />} />
      <Route path="*" element={<Navigate to="/uc" />} />
    </>
  );

  const getRoleRoutes = () => {
    switch (userRole) {
      case "Student":
        return studentRoutes;
      case "Teacher":
        return teacherRoutes;
      case "Admin":
        return adminRoutes;
      default:
        return <Route path="*" element={<Navigate to="/login" />} />;
    }
  };

  return (
    <div className="topbar">
      <Topbar />
      <div className="sidebar">
        {!isMobile && <Sidebar role={userRole} />}
        <div className="content-footer">
          <main className="content">
            <Routes>{getRoleRoutes()}</Routes>
          </main>
          <div className="footer">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/*" element={<Layout />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
