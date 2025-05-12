import React, { useContext } from "react";
import {
  Box,
  IconButton,
  Typography,
  Drawer,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import { ColorModeContext, tokens } from "../theme";
import Sidebar from "./Sidebar"; 
import { StoreContext } from '../context/StoreContext'


const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const { isMobile, isTablet, drawerOpen, toggleDrawer, id, name } = useContext(StoreContext)

  const navItems = [
    { label: "Dashboard", icon: <HomeOutlined />, path: "/" },
    { label: "Profile", icon: <PersonOutlined />, path: "/profile" },
    // Add more items here
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" >
      <Sidebar />
    </Box>
  );

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p="10px 0px"
      backgroundColor={colors.nav_bg_1}
      height="60px"
    >
      {/* LEFT: Logo and Name */}
      <Box display="flex" alignItems="center" gap="20px" >
        {isMobile && (
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography sx={{ fontSize: '28px', fontWeight: 600, color: colors.nav_text, pl: isMobile ? "0px" : "18%" }}>
              Ed<span style={{ color: 'blue' }}>Q</span>urd
            </Typography>
          </Box>

        )}

        {!isMobile && (
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Box width={isTablet ? 'auto' : '250px'} marginX={isTablet ? '20px' : '0px'} backgroundColor='' display='flex' alignItems='center' justifyContent='center'>
              <Typography sx={{ fontSize: '28px', fontWeight: 600, color: colors.nav_text }}>
                Ed<span style={{ color: 'blue' }}>Q</span>urd
              </Typography>
            </Box>

            <Typography sx={{ fontSize: 14, backgroundColor: colors.nav_bg_2, color: colors.nav_text, p: "5px 15px", borderRadius: "4px" }}>
              {id} - {name}
            </Typography>
          </Box>
        )}

      </Box>

      {/* RIGHT: Icons */}
      <Box display="flex" alignItems="center" gap="10px" marginRight='20px'>
        {!isMobile && (
          <Box
            display="flex"
            alignItems="center"
            backgroundColor={colors.nav_bg_2}
            borderRadius="4px"
            p="5px 15px"
          >
            <HomeOutlined />
            <Typography sx={{ fontSize: 14, ml: 1, color: colors.nav_text }}>Dashboard</Typography>
          </Box>
        )}

        <IconButton onClick={colorMode.toggleColorMode}>
          {colorMode.mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
        </IconButton>

        <IconButton>
          <PersonOutlined />
        </IconButton>
      </Box>

      {/* Drawer for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Topbar;

