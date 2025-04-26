// // import React from 'react';
// // import Sports from './pages/Sports';

// // function App() {
// //   return (
// //     <div>
// //       <Sports />
// //     </div>
// //   );
// // }

// // export default App;

// import { ColorModeContext, useMode } from "./theme";
// import { CssBaseline, ThemeProvider } from "@mui/material";
// import Topbar from "./components/Topbar";
// import Sidebar from "./components/Sidebar";
// import Footer from "./components/Footer";
// import Sports from './pages/Sports';
// import { Routes, Route } from "react-router-dom";
// import Dashboard from './pages/Dashboard';
// import { StoreContext } from './context/StoreContext';
// import { useContext } from "react";


// function App() {
//   const [theme, colorMode] = useMode();

//   const { isMobile} = useContext(StoreContext);

//   return (
//     <ColorModeContext.Provider value={colorMode}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <div className="topbar">
//           <Topbar />
//           <div className="sidebar">
//             {!isMobile && <Sidebar />}
//             <div className="content-footer">
//               <main className="content">    
//                 <Routes>
//                   <Route path="/" element={<Dashboard />} />
//                 </Routes>
//               </main>
//               <div className="footer">
//                 <Footer />
//               </div>
//             </div>
//           </div>
//         </div>
//       </ThemeProvider>
//     </ColorModeContext.Provider>
//   );
// }

// export default App;

// import React from 'react';
// import Sports from './pages/Sports';

// function App() {
//   return (
//     <div>
//       <Sports />
//     </div>
//   );
// }

// export default App;

import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Sports from './pages/Sports';
import { Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import { StoreContext } from './context/StoreContext';
import { useContext } from "react";
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



function App() {
  const [theme, colorMode] = useMode();

  const { isMobile} = useContext(StoreContext);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="topbar">
          <Topbar />
          <div className="sidebar">
            {!isMobile && <Sidebar />}
            <div className="content-footer">
              <main className="content">    
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/assignment-marks" element={<AssignmentMarks />} />                  
                  <Route path="/term-test-marks" element={<TermTestMarks />} />
                  <Route path="/my-subject" element={<MySubject />} />
                  <Route path="/assignment-marks" element={<AssignmentMarks />} /> 
                  <Route path="/subject/:id" element={<SubjectContent />} />
                  <Route path="/assignment-view/:assignmentName" element={<AssignmentView />} />
                  <Route path="/submission" element={<Submission />} />
                  <Route path="/content-view" element={<ContentView />} />


                  <Route path="/teacher-subject" element={<TeacherSubject />} />
                  <Route path="/teacher-content" element={<TeacherContent />} />
                  <Route path="/assignment-create" element={<AssignmentCreate />} />
                  <Route path="/add-content" element={<AddContent />} />
                  <Route path="/check-assignments" element={<CheckAssignment />} />
                  <Route path="/enter-term-test-marks" element={<AddExamMarks />} />
                
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
