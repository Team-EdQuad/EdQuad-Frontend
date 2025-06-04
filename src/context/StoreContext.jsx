// import { createContext, useEffect, useState,useMemo } from "react";
// import { useMediaQuery } from "@mui/material"; 

// export const StoreContext = createContext(null);

// const StoreContextProvider = (props) => {

//     const isMobile = useMediaQuery("(max-width:600px)");
//     const isTablet = useMediaQuery("(max-width:900px)");

//     // const [id, setId] = useState('STU031');
//     const [id, setId] = useState('STU001');
//     const [name, setName] = useState('W.K.T.P.Kularathna');

//     const [selected, setSelected] = useState("");

//     const [drawerOpen, setDrawerOpen] = useState(false);
//     const toggleDrawer = () => {
//         setDrawerOpen(!drawerOpen);
//       };

//     // const [role, setRole] = useState("Student")
//     const [role, setRole] = useState("Admin")
//     // const [role, setRole] = useState("Teacher") 


//     // const contextValue = useMemo(() => ({
//         isMobile,
//         isTablet,
//         drawerOpen,
//         setDrawerOpen,
//         toggleDrawer,
//         role,
//         setRole,
//         id,
//         setId,
//         name,
//         setName,
//         selected,
//         setSelected
//     }), [
//         isMobile,
//         isTablet,
//         drawerOpen,
//         setDrawerOpen,
//         toggleDrawer,
//         role,
//         setRole,
//         id,
//         setId,
//         name,
//         setName,
//         selected,
//         setSelected
//     ]);

//     return (
//         <StoreContext.Provider value={contextValue}>
//             {props.children}
//         </StoreContext.Provider>
//     );
// };

// export default StoreContextProvider;


import { createContext, useMemo, useState } from "react";
import { useMediaQuery } from "@mui/material";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:900px)");

  // Initialize from localStorage if available
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const [id, setId] = useState(() => localStorage.getItem("id") || null);
  const [name, setName] = useState(() => localStorage.getItem("name") || null);
  const [classId, setClassId] = useState(() => localStorage.getItem("classId") || null);

  const [selected, setSelected] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen((open) => !open);

  // Login: set state and localStorage
    const login = ({ token, role, id, name, classId }) => {
    setToken(token);
    setRole(role);
    setId(id);
    setName(name);
    setClassId(classId);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    if (classId) {
        localStorage.setItem("classId", classId);
    } else {
        localStorage.removeItem("classId");
    }
    };


  // Logout: clear state and localStorage
  
const logout = () => {
  setToken(null);
  setRole(null);
  setId(null);
  setName(null);
  setClassId(null);
  localStorage.clear();
};

  // Are we logged in?
  const isAuthenticated = !!token && !!role;

  const contextValue = useMemo(
    () => ({
      isMobile,
      isTablet,
      drawerOpen,
      setDrawerOpen,
      toggleDrawer,
      role,
      setRole,
      id,
      setId,
      name,
      setName,
      selected,
      setSelected,
      token,
      classId,
      setClassId,
      login,
      logout,
      isAuthenticated,
    }),
    [
      isMobile,
      isTablet,
      drawerOpen,
      setDrawerOpen,
      toggleDrawer,
      role,
      setRole,
      id,
      setId,
      name,
      setName,
      selected,
      setSelected,
      token,
      login,
      logout,
      isAuthenticated,
    ]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
