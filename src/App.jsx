import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { StoreContext } from './context/StoreContext'
import { useContext } from "react";

import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import UnderConstruction from "./pages/UnderConstruction";

import Sports from './pages/Sports';
import Clubandsocieties from "./pages/Clubandsocieties";
import Dashboard from './pages/Dashboard';
import AssignmentMarks from './pages/AssignmentMarks'; 
import AssignmentView from './pages/AssignmentView';
import TermTestMarks from './pages/TermTestMarks';
import MySubject from './pages/MySubject';
import SubjectContent from './pages/SubjectContent';
import Submission from './pages/Submission';
import TeacherSubject from "./pages/TeacherSubject";
import TeacherContent from "./pages/TeacherContent";
import AssignmentCreate from "./pages/AssignmentCreate";
import AddContent from "./pages/AddContent";
import CheckAssignment from "./pages/CheckAssignment";
import AddExamMarks from "./pages/AddExamMarks";
import ContentView from "./pages/ContentView";
import StudentDashboard from "./pages/StudentDashboard";
import BehavioralAnalysis from "./pages/BehavioralAnalysis"
import AssignmentFileView from "./pages/AssignmentFileView";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDasboard"
import SubmissionView from "./pages/SubmissionView";

import TeacherAnalysis from "./pages/Attendance-Module/Teacher-Analysis";
import StudentAnalysis from "./pages/Attendance-Module/Student-Analysis";
import TeacherAttendanceEntry from "./pages/Attendance-Module/Teacher-AttendanceEntry";
import StudentDocument from "./pages/Attendance-Module/Student-Document";
import TeacherDocument from "./pages/Attendance-Module/Teacher-Document";
import Login from "./pages/Login";


function App() {
  const [theme, colorMode] = useMode();

  const { isMobile, role: userRole} = useContext(StoreContext);


  const studentRoutes = (
    <Routes>
      <Route path="/" element={<StudentDashboard/>}  />
      <Route path="/dashboard" element={<StudentDashboard />} />
      <Route path="/sports" element={<Sports />} />        
      <Route path="/clubandsocieties" element={<Clubandsocieties />} />         
      <Route path="/termtestmarks" element={<TermTestMarks />} />
      <Route path="/mysubject" element={<MySubject />} />
      <Route path="/assigmentsmarks" element={<AssignmentMarks />} /> 
      
      <Route path="/subject/:subjectId" element={<SubjectContent />} />
      <Route path="/assignment-view/:assignmentId" element={<AssignmentView />} />
      <Route path="/submission/:assignment_id" element={<Submission />} />
      <Route path="/content-view/:contentId" element={<ContentView />} />
    

      <Route path="/student/attendance/analysis" element={<StudentAnalysis />} />
      <Route path="/student/attendance/document" element={<StudentDocument studentId='STU031' classId='CLS013'/>} />
      
      <Route path="/assignment-file-view" element={<AssignmentFileView />} /> 
      <Route path="/uc" element={<UnderConstruction />} />
      <Route path="*" element={<Navigate to="/uc" />} /> {/* Redirect unknown routes */}
    </Routes>
  );

  const teacherRoutes = (
    <Routes>
      <Route path="/" element={<TeacherDashboard />} />
      <Route path="/dashboard" element={<TeacherDashboard />} />
      <Route path="/sports" element={<Sports />} />
      <Route path="/clubandsocieties" element={<Clubandsocieties />} />
      <Route path="/academic" element={<TeacherSubject />} />
      <Route path="/teacher-content" element={<TeacherContent />} />
      <Route path="/assignment-create" element={<AssignmentCreate />} />
      <Route path="/add-content" element={<AddContent />} />
      <Route path="/check-assignments" element={<CheckAssignment />} />
      <Route path="/enter-term-test-marks" element={<AddExamMarks />} />
      <Route path="/attendance/entry" element={<TeacherAttendanceEntry/>} />
      <Route path="/attendance/analysis" element={<TeacherAnalysis />} />
      <Route path="/attendance/document" element={<TeacherDocument />} />
      <Route path="/uc" element={<UnderConstruction />} />
      <Route path="/behavioural-analysis" element={<BehavioralAnalysis />} />
      <Route path="/submission/view/:submissionId" element={<SubmissionView />} />
      <Route path="*" element={<Navigate to="/uc" />} /> {/* Redirect unknown routes */}
      <Route path="/login" element={<Login />} />

    </Routes>
  );

  const adminRoutes = (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/sports" element={<Sports />} />
      <Route path="/clubandsocieties" element={<Clubandsocieties />} />
      <Route path="/uc" element={<UnderConstruction />} />
      <Route path="*" element={<Navigate to="/uc" />} /> {/* Redirect unknown routes */}
    </Routes>
  );

  const getRoutes = () => {
    switch (userRole) {
      case "Student":
        return studentRoutes;
      case "Teacher":
        return teacherRoutes;
      case "Admin":
        return adminRoutes;
      default:
        return <Navigate to="/" />; // Redirect to home if role is unknown
    }
  };

  return (
    // <ColorModeContext.Provider value={colorMode}>
    //   <ThemeProvider theme={theme}>
    //     <CssBaseline />
    //     <div className="topbar">
    //       <Topbar />
    //       <div className="sidebar">
    //         {!isMobile && <Sidebar role={userRole} />} {/* Pass role to Sidebar */}
    //         <div className="content-footer">
    //           <main className="content">{getRoutes()}</main>
    //           <div className="footer">
    //             <Footer />
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </ThemeProvider>
    // </ColorModeContext.Provider>

    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
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
              <main className="content">{getRoutes()}</main>
              <div className="footer">
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;


// /attendance/analysis
