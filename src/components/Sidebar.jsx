import React, { useState, useContext, useEffect } from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../theme";
import { SubMenu } from "react-pro-sidebar";
import { StoreContext } from '../context/StoreContext'

import {
  HomeOutlined,
  PeopleOutlined,
  ContactsOutlined,
  ReceiptOutlined,
  PersonOutlined,
  CalendarTodayOutlined,
  BarChartOutlined,
  PieChartOutlineOutlined,
  TimelineOutlined,
  MenuOutlined,
  EventAvailable,
  CheckCircleOutline,
  Assessment,
  DescriptionOutlined,
  Close as CloseIcon,
  SchoolOutlined,
  EventAvailableOutlined,
  TrendingUpOutlined,
  MenuBookOutlined,
  LeaderboardOutlined,
  EmojiPeopleOutlined,
  InsightsOutlined,
  ReportProblemOutlined,
  AssignmentTurnedInOutlined,
  EditNoteOutlined,
  PsychologyOutlined,
  PersonAddAltOutlined,
  BuildCircleOutlined,
  TrackChangesOutlined,
  PersonAddAlt1Outlined,
  PersonRemoveOutlined,
  ManageAccountsOutlined
} from '@mui/icons-material';

const AppSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const { isMobile, isTablet, role, setDrawerOpen, id, name, selected, setSelected } = useContext(StoreContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync selected state with current route
  useEffect(() => {
    const path = location.pathname;
    let newSelected = "";
    
    switch(path) {
      case "/":
        newSelected = "Material Progress";
        break;
      case "/material-progress":
        newSelected = "Material Progress";
        break;
      case "/attendance/entry":
        newSelected = "Attendance Entry";
        break;
      case "/attendance/analysis":
        newSelected = "Analysis View";
        break;
      case "/attendance/document":
        newSelected = "Document";
        break;
      default:
        // Keep current selection if route doesn't match
        return;
    }
    
    setSelected(newSelected);
  }, [location.pathname, setSelected]);

  !isMobile && useEffect(() => {
    setIsCollapsed(isTablet);
  }, [isTablet]);
  

  return (

    <Box
      sx={{
        display: "flex",
        height: "100%",
        minHeight: "100%",
        "& .sidebar": {
          border: "none",
        },
      }}
    >
      <ProSidebar
        collapsed={isCollapsed}
        width="250px"
        rootStyles={{
          ".ps-sidebar-container": {
            background: colors.side_bg,
          },
          ".ps-menu-button": {
            height: "45px !important",
            padding: "5px 35px 5px 20px !important",
            backgroundColor: "transparent !important",
            borderRadius: "3px",
          },
          ".ps-menu-button:hover": {
            backgroundColor: colors.side_b_hover + "!important",
            color: colors.nav_text + "!important",
          },
          ".ps-menu-button.ps-active": {
            backgroundColor: colors.side_b_active + "!important",
            color: colors.side_text + "!important",
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
            {!isCollapsed && !isMobile && (

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
                <Typography sx={{ fontSize: '28px', fontWeight: 600, color: colors.nav_text }}>
                  Ed<span style={{ color: 'blue' }}>Q</span>uad
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
                  {role}
                </Typography>
              </Box>
            </Box>
          )}

          {/* MENU ITEMS */}
          {role === "student" && (
            <Box paddingInline={isCollapsed ? undefined : "5px"}>

              {/* Dashborad */}
              <SubMenu
                label="Dashboard"
                icon={<HomeOutlined />}
                defaultOpen={selected.startsWith("Dashboard")}
              >
                <MenuItem
                  active={selected === "Subject Progress"}
                  onClick={() => setSelected("Subject Progress")}
                  icon={<SchoolOutlined />}
                  component={<Link to="/dashboard#subject-progress" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Subject Progress" ? "#6870fa" : "#3e4396",

                  }}
                >
                  <Typography>Subject Progress</Typography>
                </MenuItem>

                <MenuItem
                  active={selected === "Assignment Timeline"}
                  onClick={() => setSelected("Assignment Timeline")}
                  icon={<TimelineOutlined />}
                  component={<Link to="/dashboard#assignment-timeline" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Assignment Timeline" ? "#6870fa" : "#3e4396",
                  }}
                >
                  Assignment Timeline
                </MenuItem>

                <MenuItem
                  active={selected === "Attendance"}
                  onClick={() => setSelected("Attendance")}
                  icon={<EventAvailableOutlined />}
                  component={<Link to="/dashboard#attendance" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Attendance" ? "#6870fa" : "#3e4396",
                  }}
                >
                  Attendance
                </MenuItem>

                <MenuItem
                  active={selected === "Acadamic Performance"}
                  onClick={() => setSelected("Acadamic Performance")}
                  icon={<BarChartOutlined />}
                  component={<Link to="/dashboard#academic-performance" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Acadamic Performance" ? "#6870fa" : "#3e4396",
                  }}
                >
                  Acadamic Performance
                </MenuItem>

                <MenuItem
                  active={selected === "Predictive Analysis"}
                  onClick={() => setSelected("Predictive Analysis")}
                  icon={<TrendingUpOutlined />}
                  component={<Link to="/dashboard#predictive-analysis" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Predictive Analysis" ? "#6870fa" : "#3e4396",
                  }}
                >
                  Predictive Analysis
                </MenuItem>

              </SubMenu>

              <MenuItem
                active={selected === "My Subject"}
                onClick={() => setSelected("My Subject")}
                icon={<PeopleOutlined />}
                component={<Link to="/mysubject" />}
              >
                <Typography>My Subject</Typography>
              </MenuItem>

              <MenuItem
                active={selected === "My Profile"}
                onClick={() => setSelected("My Profile")}
                icon={<ContactsOutlined />}
                component={<Link to="/my-profile" />}
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


              {/* Attendance */}
              <SubMenu
                label="Attendance"
                icon={<EventAvailable />}
                defaultOpen={selected.startsWith("Attendance")}
              >
                <MenuItem
                  active={selected === "Analysis View"}
                  onClick={() => setSelected("Analysis View")}
                  icon={<Assessment />}
                  component={<Link to="/student/attendance/analysis" />}
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
                  component={<Link to="/student/attendance/document" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Document" ? "#6870fa" : "#3e4396",
                  }}
                >
                  Document
                </MenuItem>
              </SubMenu>

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
                component={<Link to="/assigmentsmarks" />}
              >
                <Typography>Assigments Marks</Typography>
              </MenuItem>
            </Box>
          )}
          {role === 'teacher' && (
            <Box paddingInline={isCollapsed ? undefined : "5px"}>

              {/* Dashborad */}
              <SubMenu
                label="Dashboard"
                icon={<HomeOutlined />}
                defaultOpen={selected.startsWith("Dashboard")}
                rootStyles={{
                  '.ps-submenu-content': {
                    paddingLeft: "16px",
                    backgroundColor: colors.side_bg,
                  },
                  '.ps-menuitem-root': {
                    color: colors.side_b_submenu_text + '!important',
                  },
                  '.ps-menuitem-root:hover': {
                    backgroundColor: colors.side_b_hover + "!important",
                    color: colors.nav_text + "!important",
                  },
                  '.ps-menuitem-root.active': {
                    backgroundColor: colors.side_b_active + "!important",
                    color: colors.side_text + "!important",
                  },
                }}
              >
                <MenuItem
                  active={selected === "Material Progress"}
                  onClick={() => setSelected("Material Progress")}
                  icon={<MenuBookOutlined />}
                  component={<Link to="/dashboard#material-progress" />}
                >
                  <Typography>Material Progress</Typography>
                </MenuItem>

                <MenuItem
                  active={selected === "Class Performance"}
                  onClick={() => setSelected("Class Performance")}
                  icon={<LeaderboardOutlined />}
                  component={<Link to="/dashboard#class-performance" />}
                >
                  Class Performance
                </MenuItem>

                <MenuItem
                  active={selected === "Student Progress"}
                  onClick={() => setSelected("Student Progress")}
                  icon={<EmojiPeopleOutlined />}
                  component={<Link to="/dashboard#student-progress" />}
                >
                  Student Progress
                </MenuItem>

                <MenuItem
                  active={selected === "Attendance Analysis"}
                  onClick={() => setSelected("Attendance Analysis")}
                  icon={<InsightsOutlined />}
                  component={<Link to="/dashboard#attendance-analysis" />}
                >
                  Attendance Analysis
                </MenuItem>

                <MenuItem
                  active={selected === "Attendance Risk"}
                  onClick={() => setSelected("Attendance Risk")}
                  icon={<ReportProblemOutlined />}
                  component={<Link to="/dashboard#attendance-risk" />}
                >
                  Attendance Risk
                </MenuItem>
              </SubMenu>

              <MenuItem
                active={selected === "My Profile"}
                onClick={() => setSelected("My Profile")}
                icon={<ContactsOutlined />}
                component={<Link to="/my-profile" />}
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
                active={selected === "Academic"}
                onClick={() => setSelected("Academic")}
                icon={<SchoolOutlined />}
                component={<Link to="/academic" />}
              >
                <Typography>Academic</Typography>
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

              {/* Attendance */}
              <SubMenu
                label="Attendance"
                icon={<EventAvailable />}
                defaultOpen={selected.startsWith("Attendance")}
                rootStyles={{
                  '.ps-submenu-content': {
                    paddingLeft: "16px",
                    backgroundColor: colors.side_bg,
                  },
                  '.ps-menuitem-root': {
                    color: colors.side_b_submenu_text + '!important',
                  },
                  '.ps-menuitem-root:hover': {
                    backgroundColor: colors.side_b_hover + "!important",
                    color: colors.nav_text + "!important",
                  },
                  '.ps-menuitem-root.active': {
                    backgroundColor: colors.side_b_active + "!important",
                    color: colors.side_text + "!important",
                  },
                }}
              >

                <MenuItem
                  active={selected === "Attendance Entry"}
                  onClick={() => setSelected("Attendance Entry")}
                  icon={<CheckCircleOutline />}
                  component={<Link to="/attendance/entry" />}
                  style={{
                    // marginLeft: "16px",
                    // color: selected === "Attendance Entry" ? "#6870fa" : "#3e4396",

                  }}
                >
                  <Typography>Attendance Entry</Typography>
                </MenuItem>

                <MenuItem
                  active={selected === "Analysis View"}
                  onClick={() => setSelected("Analysis View")}
                  icon={<Assessment />}
                  component={<Link to="/attendance/analysis" />}
                >
                  Analysis View
                </MenuItem>

                <MenuItem
                  active={selected === "Document"}
                  onClick={() => setSelected("Document")}
                  icon={<DescriptionOutlined />}
                  component={<Link to="/attendance/document" />}
                >
                  Document
                </MenuItem>
              </SubMenu>

              <MenuItem
                active={selected === "Check Assignments"}
                onClick={() => setSelected("Check Assignments")}
                icon={<AssignmentTurnedInOutlined />}
                component={<Link to="/check-assignments" />}
              >
                <Typography>Check Assignments</Typography>
              </MenuItem>

              <MenuItem
                active={selected === "Review AI-Graded Assignments"}
                onClick={() => setSelected("Review AI-Graded Assignments")}
                icon={<EditNoteOutlined />}
                component={<Link to="/check-auto-graded" />}
              >
                <Typography>Review AI-Graded Assignments</Typography>
              </MenuItem>


              <MenuItem
                active={selected === "Enter term-test marks"}
                onClick={() => setSelected("Enter term-test marks")}
                icon={<EditNoteOutlined />}
                component={<Link to="/enter-term-test-marks" />}
              >
                <Typography>Enter term-test marks</Typography>
              </MenuItem>

              <MenuItem
                active={selected === "Behavioural analysis"}
                onClick={() => setSelected("Behavioural analysis")}
                icon={<PsychologyOutlined />}
                component={<Link to="/behavioural-analysis" />}
              >
                <Typography>Behavioural analysis</Typography>
              </MenuItem>


            </Box>
          )}
          {role === 'admin' && (
            <Box paddingInline={isCollapsed ? undefined : "5px"}>

              {/* Dashborad */}
              <SubMenu
                label="Dashboard"
                icon={<HomeOutlined />}
                defaultOpen={selected.startsWith("Dashboard")}
              >
                <MenuItem
                  active={selected === "Class Performance"}
                  onClick={() => setSelected("Class Performance")}
                  icon={<LeaderboardOutlined />}
                  component={<Link to="/dashboard#class-performance" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Class Performance" ? "#6870fa" : "#3e4396",
                  }}
                >
                  Class Performance
                </MenuItem>

                <MenuItem
                  active={selected === "Student Progress"}
                  onClick={() => setSelected("Student Progress")}
                  icon={<EmojiPeopleOutlined />}
                  component={<Link to="/dashboard#student-progress" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Student Progress" ? "#6870fa" : "#3e4396",
                  }}
                >
                  Student Progress
                </MenuItem>

                <MenuItem
                  active={selected === "Attendance Analysis"}
                  onClick={() => setSelected("Attendance Analysis")}
                  icon={<InsightsOutlined />}
                  component={<Link to="/dashboard#attendance-analysis" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Attendance Analysis" ? "#6870fa" : "#3e4396",
                  }}
                >
                  Attendance Analysis
                </MenuItem>

                <MenuItem
                  active={selected === "Attendance Risk"}
                  onClick={() => setSelected("Attendance Risk")}
                  icon={<ReportProblemOutlined />}
                  component={<Link to="/dashboard#attendance-risk" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Attendance Risk" ? "#6870fa" : "#3e4396",
                  }}
                >
                  Attendance Risk
                </MenuItem>
              </SubMenu>

              <MenuItem
                active={selected === "My Profile"}
                onClick={() => setSelected("My Profile")}
                icon={<ContactsOutlined />}
                component={<Link to="/my-profile" />}
              >
                <Typography>My Profile</Typography>
              </MenuItem>

              <MenuItem
                active={selected === "Calendar Management"}
                onClick={() => setSelected("Calendar Management")}
                icon={<CalendarTodayOutlined />}
                component={<Link to="/admin-calendar" />}
              >
                <Typography>Calendar Management</Typography>
              </MenuItem>

              <MenuItem
                active={selected === "Add Student"}
                onClick={() => setSelected("Add Student")}
                icon={<PersonAddAltOutlined />}
                component={<Link to="/add-student" />}
              >
                <Typography>Add Student</Typography>
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

              {/* Operation */}
              <SubMenu
                label="Operation"
                icon={<BuildCircleOutlined />}
                defaultOpen={selected.startsWith("Operation")}
              >
                <MenuItem
                  active={selected === "Add Teacher"}
                  onClick={() => setSelected("Add Teacher")}
                  icon={<PersonAddAlt1Outlined />}
                  component={<Link to="/add-teacher" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Add Teacher" ? "#6870fa" : "#3e4396",
                  }}
                >
                  Add Teacher
                </MenuItem>

                <MenuItem
                  active={selected === "Add Student"}
                  onClick={() => setSelected("Add Student")}
                  icon={<PersonAddAltOutlined />}
                  component={<Link to="/add-student" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Add Student" ? "#6870fa" : "#3e4396",
                  }}
                >
                  Add Student
                </MenuItem>

                <MenuItem
                  active={selected === "Delete User"}
                  onClick={() => setSelected("Delete User")}
                  icon={<PersonRemoveOutlined />}
                  component={<Link to="/delete-user" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Delete User" ? "#6870fa" : "#3e4396",
                  }}
                >
                  Delete User
                </MenuItem>

                <MenuItem
                  active={selected === "Update User"}
                  onClick={() => setSelected("Update User")}
                  icon={<ManageAccountsOutlined />}
                  component={<Link to="/update-user" />}
                  style={{
                    marginLeft: "16px",
                    color: selected === "Update User" ? "#6870fa" : "#3e4396",
                  }}
                >
                  Update User
                </MenuItem>
              </SubMenu>

              <MenuItem
                active={selected === "Access Tracking"}
                onClick={() => setSelected("Access Tracking")}
                icon={<TrackChangesOutlined />}
                component={<Link to="/access-tracking" />}
              >
                <Typography>Access Tracking</Typography>
              </MenuItem>

            </Box>
          )}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default AppSidebar;