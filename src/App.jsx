import React, { useContext } from 'react';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StoreContext } from './context/StoreContext'; // Adjust the path if needed.

// Pages
import LoginPage from './pages/LoginPage'; // Import the new LoginPage
import UnderConstruction from "./pages/UnderConstruction";
import Sports from './pages/Sports';
import Clubandsocieties from "./pages/Clubandsocieties";
import Dashboard from './pages/Dashboard';
import AssignmentMarks from './pages/AssignmentMarks';
import AssignmentView from './pages/AssignmentView';
import TermTestMarks from './pages/TermTestMarks';
import MySubject from './pages/MySubject';
import SubjectContent from './pages/SubjectContent';
import Submission from "./pages/Submission";
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
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    const [theme, colorMode] = useMode();
    const {  role: userRole } = useContext(StoreContext); // No need for isMobile here

    // Show login page by default, when there is no userRole
    if (!userRole) {
        return (
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </ThemeProvider>
            </ColorModeContext.Provider>
        );
    }

    // Student Routes
    const studentRoutes = (
        <Routes>
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
             <Route path="/assignment-file-view" element={<AssignmentFileView />} />
            <Route path="/uc" element={<UnderConstruction />} />
            <Route path="*" element={<Navigate to="/uc" />} />
        </Routes>
    );

    // Teacher Routes
      const teacherRoutes = (
        <Routes>
            <Route path="/dashboard" element={<TeacherDashboard />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/clubandsocieties" element={<Clubandsocieties />} />
            <Route path="/academic" element={<TeacherSubject />} />
            <Route path="/teacher-content" element={<TeacherContent />} />
            <Route path="/assignment-create" element={<AssignmentCreate />} />
            <Route path="/add-content" element={<AddContent />} />
            <Route path="/check-assignments" element={<CheckAssignment />} />
            <Route path="/enter-term-test-marks" element={<AddExamMarks />} />
            <Route path="/behavioural-analysis" element={<BehavioralAnalysis />} />
            <Route path="/assignment-file-view" element={<AssignmentFileView />} />
            <Route path="/content-view/:contentId" element={<ContentView />} />
             <Route path="/assignment-view/:assignmentId" element={<AssignmentView />} />
              <Route path="/submission/:assignment_id" element={<Submission />} />
            <Route path="/uc" element={<UnderConstruction />} />
            <Route path="*" element={<Navigate to="/uc" />} />
        </Routes>
    );

    // Admin Routes
    const adminRoutes = (
        <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/clubandsocieties" element={<Clubandsocieties />} />
            <Route path="/academic" element={<TeacherSubject />} />
            <Route path="/uc" element={<UnderConstruction />} />
            <Route path="*" element={<Navigate to="/uc" />} />
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
                return  <Routes>
                         <Route path="/" element={<LoginPage />} />
                         <Route path="*" element={<Navigate to="/" />} />
                       </Routes>;
        }
    };

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    {userRole &&
                    <>
                        <Topbar />
                        <div className="sidebar">
                            <Sidebar role={userRole} />
                            <div className="content-footer">
                                <main className="content">{getRoutes()}</main>
                                <div className="footer">
                                    <Footer />
                                </div>
                            </div>
                        </div>
                     </>
                    }
                    {!userRole && getRoutes()}
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
