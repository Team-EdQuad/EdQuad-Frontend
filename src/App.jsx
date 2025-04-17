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
                  <Route path="/" element={<Sports />} />
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
