import React, { useContext, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import { ColorModeContext, tokens } from "../theme";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar"; // Assuming you have a Sidebar component
import { StoreContext } from '../context/StoreContext'; 

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  // const isMobile = useMediaQuery("(max-width:768px)");

  // const [drawerOpen, setDrawerOpen] = useState(false);

  // const toggleDrawer = () => {
  //   setDrawerOpen(!drawerOpen);
  // };

  const { isMobile, isTablet, drawerOpen, setDrawerOpen, toggleDrawer} = useContext(StoreContext)

  const navItems = [
    { label: "Dashboard", icon: <HomeOutlined />, path: "/" },
    { label: "Profile", icon: <PersonOutlined />, path: "/profile" },
    // Add more items here
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" >
        {/* <Box mt="10px" display="flex" justifyContent="center" alignItems="center" gap="20px">
            <Typography sx={{ fontSize: '28px', fontWeight: 600 }}>
                Ed<span style={{ color: 'blue' }}>Q</span>urd
            </Typography>
        </Box> */}
      {/* <List>
        {navItems.map((item) => (
          <ListItem button component={Link} to={item.path} key={item.label}>
            {item.icon}
            <ListItemText primary={item.label} sx={{ ml: 2 }} />
          </ListItem>
        ))}
      </List> */}
      <Sidebar />
    </Box>
  );

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p="10px 20px"
      // backgroundColor="#D9D9D9"
      backgroundColor={colors.nav_bg_1}
      height="60px"
    >
      {/* LEFT: Logo and Name */}
      <Box display="flex" alignItems="center" gap="20px" >
        {isMobile && (
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography sx={{ fontSize: '28px', fontWeight: 600, color: colors.nav_text, pl: isMobile ? "0px" : "18%" }}>
          Ed<span style={{ color: 'blue' }}>Q</span>uad
        </Typography>
        {!isMobile && (
          <Typography sx={{ fontSize: 14, backgroundColor: colors.nav_bg_2, color: colors.nav_text, p: "5px 15px", ml: "52px", borderRadius: "4px" }}>
            225571T - W K T P Kularathna
          </Typography>
        )}
      </Box>

      {/* RIGHT: Icons */}
      <Box display="flex" alignItems="center" gap="10px">
        {!isMobile && (
          <Box
            display="flex"
            alignItems="center"
            backgroundColor= {colors.nav_bg_2}
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