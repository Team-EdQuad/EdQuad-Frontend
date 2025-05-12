import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { StoreContext } from './context/StoreContext'
import { useContext } from "react";

import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Dashboard from './pages/dashboard';
import TeacherAnalysis from "./pages/Attendance-Module/Teacher-Analysis";
import StudentAnalysis from "./pages/Attendance-Module/Student-Analysis";
import TeacherAttendanceEntry from "./pages/Attendance-Module/Teacher-AttendanceEntry";
import StudentDocument from "./pages/Attendance-Module/Student-Document";
import TeacherDocument from "./pages/Attendance-Module/Teacher-Document";


function App() {
  const [theme, colorMode] = useMode();

  const { isMobile} = useContext(StoreContext);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="panel">
          <div className="top-panel">
            <Topbar />
          </div>  
          <div className="bottom-panel">
            <div className="bottom-left-panel">
              {!isMobile && <Sidebar />}
            </div>
            <div className="bottom-right-panel">
              <main className="content">    
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/attendance/entry" element={<TeacherAttendanceEntry/>} />
                  <Route path="/attendance/analysis" element={<TeacherAnalysis />} />
                  <Route path="/attendance/document" element={<TeacherDocument />} />
                  <Route path="/student/attendance/analysis" element={<StudentAnalysis />} />
                  <Route path="/student/attendance/document" element={<StudentDocument studentId='STD001' classId='CLS008'/>} />
                </Routes>
              </main>
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
