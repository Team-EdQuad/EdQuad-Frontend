
import React, { useState, useContext } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from "react-router-dom";
import { tokens } from "../theme";
import { SubMenu } from "react-pro-sidebar";
import { StoreContext } from "../context/StoreContext.jsx";
// Import icons using named imports (more efficient)
import { 
  HomeOutlined,
  PeopleOutlined,
  ContactsOutlined,
  ReceiptOutlined,
  PersonOutlined,
  CalendarTodayOutlined,
  HelpOutlined,
  BarChartOutlined,
  PieChartOutlineOutlined,
  TimelineOutlined,
  MenuOutlined,
  MapOutlined,
  EventAvailable,
  CheckCircleOutline,
  Assessment,
  DescriptionOutlined,
  Close as CloseIcon,
} from '@mui/icons-material';

import { useEffect } from "react";



const AppSidebar = () => {  // Changed component name to avoid conflict
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const { isMobile, isTablet, role, drawerOpen, setDrawerOpen, toggleDrawer} = useContext(StoreContext)

  !isMobile && useEffect(() => {
    setIsCollapsed(isTablet);
    console.log("isTablet", isTablet)
    
  }, [isTablet]);

  const fullText = "225571T - W K T P Kularathna";
  const [id, name] = fullText.split(" - ");

  return (

    <Box
      sx={{
        display: "flex",
        height: "100%",
        minHeight: "100vh",
        "& .sidebar": {
          border: "none",
        },
      }}
    >
      <ProSidebar  // Using the aliased import
        collapsed={isCollapsed}
        width="250px"
        rootStyles={{
          ".ps-sidebar-container": {
            background: colors.side_bg,
            // background: `${colors.primary[400]} !important`,
          },
          ".ps-menu-button": {
            height: "45px",
            padding: "5px 35px 5px 20px !important",
            backgroundColor: "transparent !important",
            borderRadius: "3px",
            // color: "#3e4396",
          },
          ".ps-menu-button:hover": {
            backgroundColor: colors.side_b_hover + "!important",
            color: "#fff !important",
          },
          ".ps-menu-button.ps-active": {
            backgroundColor: colors.side_b_active + "!important",
            color: "blue !important",
          },
        }}
      >
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlined /> : undefined}
            style={{
              margin: "10px 0 10px 0",
              color: colors.gray[100],
            }}
          >
            {!isCollapsed && !isMobile &&(
              
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h5" color={colors.gray[100]}>
                  {role.toUpperCase()}
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlined />
                </IconButton>
              </Box>
            )}
            {!isCollapsed && isMobile && (
              
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography sx={{ fontSize: '28px', fontWeight: 600 }}>
                  Ed<span style={{ color: 'blue' }}>Q</span>urd
                </Typography>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USER */}
          {!isCollapsed && isMobile && (
            <Box mb="25px">
              {/* <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box> */}
              <Box textAlign="center">
                <Typography
                  variant="h5"
                  color={colors.gray[100]}
                  fontWeight="medium"
                  // style={{ marginLeft: "25px" }}
                >
                  {id}
                </Typography>
                <Typography
                  variant="h5"
                  color={colors.gray[300]}
                  fontWeight="medium"
                  // sx={{ m: "0" }}
                >
                  {name}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Admin
                </Typography>
              </Box>
            </Box>
          )}

          {/* MENU ITEMS */}
          {role === "Student" && (
            <Box paddingInline={isCollapsed ? undefined : "5px"}>
            <MenuItem
              active={selected === "Dashboard"}
              onClick={() => setSelected("Dashboard")}
              icon={<HomeOutlined />}
              component={<Link to="/" />}
            >
              <Typography>Dashboard</Typography>
            </MenuItem>

            <MenuItem
              active={selected === "My Subject"}
              onClick={() => setSelected("My Subject")}
              icon={<PeopleOutlined />}
              component={<Link to="/my-subject" />}
            >
              <Typography>My Subject</Typography>
            </MenuItem>

            <MenuItem
              active={selected === "My Profile"}
              onClick={() => setSelected("My Profile")}
              icon={<ContactsOutlined />}
              component={<Link to="/myprofile" />}
            >
              <Typography>My Profile</Typography>
            </MenuItem>

            <MenuItem
              active={selected === "Calender"}
              onClick={() => setSelected("Calender")}
              icon={<ReceiptOutlined />}
              component={<Link to="/calender" />}
            >
              <Typography>Calender</Typography>
            </MenuItem>

            <MenuItem
              active={selected === "Sports"}
              onClick={() => setSelected("Sports")}
              icon={<PersonOutlined />}
              component={<Link to="/sports" />}
            >
              <Typography>Sports</Typography>
            </MenuItem>

            <MenuItem
              active={selected === "Club & Societies"}
              onClick={() => setSelected("Club & Societies")}
              icon={<CalendarTodayOutlined />}
              component={<Link to="/clubandsocieties" />}
            >
              <Typography>Club & Societies</Typography>
            </MenuItem>


            {/* Attendance Module  */}

            <SubMenu
              label="Attendance"
              icon={<EventAvailable />}
              defaultOpen={selected.startsWith("Attendance")}
              style={{
                // backgroundColor: "#6870fa !important"
              }}
              
            >
              <MenuItem
                active={selected === "Attendance Entry"}
                onClick={() => setSelected("Attendance Entry")}
                icon={<CheckCircleOutline />}
                component={<Link to="/attendance/entry" />}
                style={{
                  marginLeft: "16px",
                  color: selected === "Attendance Entry" ? "#6870fa" : "#3e4396",
                }}
              >
                Attendance Entry
              </MenuItem>


              <MenuItem
                active={selected === "Analysis View"}
                onClick={() => setSelected("Analysis View")}
                icon={<Assessment />}
                component={<Link to="/attendance/analysis" />}
                style={{
                  marginLeft: "16px",
                  color: selected === "Analysis View" ? "#6870fa" : "#3e4396",
                }}
              >
                Analysis View
              </MenuItem>

              <MenuItem
                active={selected === "Document"}
                onClick={() => setSelected("Document")}
                icon={<DescriptionOutlined />}
                component={<Link to="/attendance/document" />}
                style={{
                  marginLeft: "16px",
                  color: selected === "Document" ? "#6870fa" : "#3e4396",
                }}
              >
                Document
              </MenuItem>
            </SubMenu>





            {/* <Typography
              variant="h6"
              color={colors.gray[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography> */}

            <MenuItem
              active={selected === "Term Test Marks"}
              onClick={() => setSelected("Term Test Marks")}
              icon={<BarChartOutlined />}
              component={<Link to="/termtestmarks" />}
            >
              <Typography>Term Test Marks</Typography>
            </MenuItem>

            <MenuItem
              active={selected === "Assigments Marks"}
              onClick={() => setSelected("Assigments Marks")}
              icon={<PieChartOutlineOutlined />}
              component={<Link to="/assignment-marks" />}
            >
              <Typography>Assigments Marks</Typography>
            </MenuItem>
          </Box>
          )}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default AppSidebar;