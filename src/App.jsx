import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { Routes, Route, Navigate } from "react-router-dom";
import { StoreContext } from './context/StoreContext';
import { useContext } from "react";

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
      <Route path="/subject/:id" element={<SubjectContent />} />
      <Route path="/assignment-view/:assignmentName" element={<AssignmentView />} />
      <Route path="/submission" element={<Submission />} />
      <Route path="/content-view" element={<ContentView />} />
      <Route path="/uc" element={<UnderConstruction />} />
      <Route path="*" element={<Navigate to="/uc" />} /> {/* Redirect unknown routes */}
    </Routes>
  );

  const teacherRoutes = (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/sports" element={<Sports />} />
      <Route path="/clubandsocieties" element={<Clubandsocieties />} />
      <Route path="/academic" element={<TeacherSubject />} />
      <Route path="/teacher-content" element={<TeacherContent />} />
      <Route path="/assignment-create" element={<AssignmentCreate />} />
      <Route path="/add-content" element={<AddContent />} />
      <Route path="/check-assignments" element={<CheckAssignment />} />
      <Route path="/enter-term-test-marks" element={<AddExamMarks />} />
      <Route path="/uc" element={<UnderConstruction />} />
      <Route path="/behavioural-analysis" element={<BehavioralAnalysis />} />
      <Route path="*" element={<Navigate to="/uc" />} /> {/* Redirect unknown routes */}
    </Routes>
  );

  const adminRoutes = (
    <Routes>
      <Route path="/" element={<Dashboard />} />
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
    //         {!isMobile && <Sidebar />}
    //         <div className="content-footer">
    //           <main className="content">    
    //             <Routes>
    //               <Route path="/" element={<Dashboard />} />
                  // <Route path="/sports" element={<Sports />} />
                  // <Route path="/assignment-marks" element={<AssignmentMarks />} />                  
                  // <Route path="/term-test-marks" element={<TermTestMarks />} />
                  // <Route path="/my-subject" element={<MySubject />} />
                  // <Route path="/assignment-marks" element={<AssignmentMarks />} /> 
                  // <Route path="/subject/:id" element={<SubjectContent />} />
                  // <Route path="/assignment-view/:assignmentName" element={<AssignmentView />} />
                  // <Route path="/submission" element={<Submission />} />
                  // <Route path="/content-view" element={<ContentView />} />


                  // <Route path="/teacher-subject" element={<TeacherSubject />} />
                  // <Route path="/teacher-content" element={<TeacherContent />} />
                  // <Route path="/assignment-create" element={<AssignmentCreate />} />
                  // <Route path="/add-content" element={<AddContent />} />
                  // <Route path="/check-assignments" element={<CheckAssignment />} />
                  // <Route path="/enter-term-test-marks" element={<AddExamMarks />} />
                
                  // <Route path="/clubandsocieties" element={<Clubandsocieties />} />
    //             </Routes>
    //           </main>
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
        <div className="topbar">
          <Topbar />
          <div className="sidebar">
            {!isMobile && <Sidebar role={userRole} />} {/* Pass role to Sidebar */}
            <div className="content-footer">
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
