// import React, { useContext, useState } from "react";
// import {
//   Box,
//   IconButton,
//   Typography,
//   Drawer,
//   useTheme,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
// import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
// import PersonOutlined from "@mui/icons-material/PersonOutlined";
// import HomeOutlined from "@mui/icons-material/HomeOutlined";
// import { ColorModeContext, tokens } from "../theme";
// import Sidebar from "./Sidebar"; 
// import { StoreContext } from '../context/StoreContext'
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";


// const Topbar = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const colorMode = useContext(ColorModeContext);

//   const { isMobile, isTablet, drawerOpen, toggleDrawer, id, name } = useContext(StoreContext)
//   const { logout } = useContext(StoreContext);

//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleUserIconClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     logout();
//     handleMenuClose();
//     // Optionally, redirect to login page
//     window.location.href = "/login";
//   };
  
//   const navItems = [
//     { label: "Dashboard", icon: <HomeOutlined />, path: "/" },
//     { label: "Profile", icon: <PersonOutlined />, path: "/profile" },
//     // Add more items here
//   ];

//   const drawer = (
//     <Box sx={{ width: 250 }} role="presentation" >
//       <Sidebar />
//     </Box>
//   );

//   return (
//     <Box
//       display="flex"
//       justifyContent="space-between"
//       alignItems="center"
//       p="10px 0px"
//       backgroundColor={colors.nav_bg_1}
//       height="60px"
//     >
//       {/* LEFT: Logo and Name */}
//       <Box display="flex" alignItems="center" gap="20px" >
//         {isMobile && (
//           <Box display="flex" justifyContent="flex-start" alignItems="center">
//             <IconButton onClick={toggleDrawer}>
//               <MenuIcon />
//             </IconButton>
//             <Typography sx={{ fontSize: '28px', fontWeight: 600, color: colors.nav_text, pl: isMobile ? "0px" : "18%" }}>
//               Ed<span style={{ color: 'blue' }}>Q</span>uad
//             </Typography>
//           </Box>

//         )}

//         {!isMobile && (
//           <Box display="flex" justifyContent="flex-start" alignItems="center">
//             <Box width={isTablet ? 'auto' : '250px'} marginX={isTablet ? '20px' : '0px'} backgroundColor='' display='flex' alignItems='center' justifyContent='center'>
//               <Typography sx={{ fontSize: '28px', fontWeight: 600, color: colors.nav_text }}>
//                 Ed<span style={{ color: 'blue' }}>Q</span>uad
//               </Typography>
//             </Box>

//             <Typography sx={{ fontSize: 14, backgroundColor: colors.nav_bg_2, color: colors.nav_text, p: "5px 15px", borderRadius: "4px" }}>
//               {id} - {name}
//             </Typography>
//           </Box>
//         )}

//       </Box>

//       {/* RIGHT: Icons */}
//       <Box display="flex" alignItems="center" gap="10px" marginRight='20px'>
//         {!isMobile && (
//           <Box
//             display="flex"
//             alignItems="center"
//             backgroundColor={colors.nav_bg_2}
//             borderRadius="4px"
//             p="5px 15px"
//           >
//             <HomeOutlined />
//             <Typography sx={{ fontSize: 14, ml: 1, color: colors.nav_text }}>Dashboard</Typography>
//           </Box>
//         )}

//         <IconButton onClick={colorMode.toggleColorMode}>
//           {colorMode.mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
//         </IconButton>
        
//         <Menu
//           id="user-menu"
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleMenuClose}
//           anchorOrigin={{
//             vertical: "bottom",
//             horizontal: "right",
//           }}
//           transformOrigin={{
//             vertical: "top",
//             horizontal: "right",
//           }}
//           keepMounted
//         >
//           <MenuItem onClick={handleLogout}>Logout</MenuItem>
//         </Menu>

//         <IconButton
//           onClick={handleUserIconClick}
//           aria-controls={open ? "user-menu" : undefined}
//           aria-haspopup="true"
//           aria-expanded={open ? "true" : undefined}
//         >
//           <PersonOutlined />
//         </IconButton>
//       </Box>

//       {/* Drawer for Mobile */}
//       <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
//         {drawer}
//       </Drawer>
//     </Box>
//   );
// };

// export default Topbar;

import React, { useContext, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Drawer,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import { ColorModeContext, tokens } from "../theme";
import Sidebar from "./Sidebar";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";


const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const { isMobile, isTablet, drawerOpen, toggleDrawer, id, name } =
    useContext(StoreContext);
  const { logout } = useContext(StoreContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleUserIconClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    handleMenuClose();
    window.location.href = "/login";
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Sidebar />
    </Box>
  );

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p="10px 25px"
      sx={{
        backgroundColor:
          theme.palette.mode === "dark" ? colors.primary[400] : "#eaeaea",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        height: "70px",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        zIndex: 1100,
      }}
    >
      {/* LEFT: Logo and Name */}
      <Box display="flex" alignItems="center" gap="20px">
        {isMobile && (
          <Box display="flex" alignItems="center">
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography
              sx={{
                fontSize: "28px",
                fontWeight: 600,
                color: colors.nav_text,
                pl: "10px",
              }}
            >
              Ed<span style={{ color: "blue" }}>Q</span>uad
            </Typography>
          </Box>
        )}

        {!isMobile && (
          <Box display="flex" alignItems="center">
            <Box
              width={isTablet ? "auto" : "250px"}
              mx={isTablet ? "20px" : "0px"}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                sx={{ fontSize: "28px", fontWeight: 600, color: colors.nav_text }}
              >
                Ed<span style={{ color: "blue" }}>Q</span>uad
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 14,
                backgroundColor:
                  theme.palette.mode === "dark" ? colors.primary[500] : "#dddddd",
                color: theme.palette.mode === "dark" ? "#fff" : "#333",
                p: "6px 16px",
                borderRadius: "6px",
                fontWeight: 500,
              }}
            >
              {id} - {name}
            </Typography>
          </Box>
        )}
      </Box>

      {/* RIGHT: Icons */}
      <Box display="flex" alignItems="center" gap="12px" mr="10px">
        {!isMobile && (
          <Box
            display="flex"
            alignItems="center"
            backgroundColor={
              theme.palette.mode === "dark" ? colors.primary[500] : "#dddddd"
            }
            borderRadius="6px"
            p="6px 16px"
            sx={{ cursor: "pointer" }} // Add pointer cursor
            onClick={() => navigate("/dashboard")} // Add navigation
          >
            <HomeOutlined />
            <Typography sx={{ fontSize: 14, ml: 1, color: colors.nav_text }}>
              Dashboard
            </Typography>
          </Box>
        )}

        <IconButton onClick={colorMode.toggleColorMode}>
          {colorMode.mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
        </IconButton>

        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        <IconButton
          onClick={handleUserIconClick}
          aria-controls={open ? "user-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <PersonOutlined />
        </IconButton>
      </Box>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Topbar;
