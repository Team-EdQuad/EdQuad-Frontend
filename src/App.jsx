import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Sports from './pages/Sports';
import Clubandsocieties from "./pages/Clubandsocieties";
import { Routes, Route } from "react-router-dom";
import Dashboard from './pages/StudentDashboard';
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
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/sports" element={<Sports />} />
                  <Route path="/clubandsocieties" element={<Clubandsocieties />} />
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
