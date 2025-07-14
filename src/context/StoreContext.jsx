import { createContext, useMemo, useState } from "react";
import { useMediaQuery } from "@mui/material";
const Url = import.meta.env.VITE_BACKEND_URL
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:900px)");
  
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const [id, setId] = useState(() => localStorage.getItem("id") || null);
  const [name, setName] = useState(() => localStorage.getItem("name") || null);
  const [classId, setClassId] = useState(() => localStorage.getItem("classId") || null);
  const [selected, setSelected] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const toggleDrawer = () => setDrawerOpen((open) => !open);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info', 
    duration: 3000
  });
  
  const showNotification = (message, severity = 'info', duration = 3000) => {
    setNotification({
      open: true,
      message,
      severity,
      duration
    });
  };
  
  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };
  
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
  
  const logout = async () => {
    const currentToken = localStorage.getItem("token");
    const currentRole = localStorage.getItem("role");
    const currentId = localStorage.getItem("id");
    
    setToken(null);
    setRole(null);
    setId(null);
    setName(null);
    setClassId(null);
    localStorage.clear();
    
    try {
      if (currentToken && currentRole && currentId) {
        const res = await fetch(`${Url}/api/user-management/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${currentToken}`,
          },
          body: new URLSearchParams({
            user_id: currentId,
            role: currentRole,
          }),
        });
        const data = await res.json();
        console.log("Logout response:", data);
      }
    } catch (e) {
      console.error("Logout API error", e);
    }
    
    window.location.href = '/login';
  };
  
  const isAuthenticated = () => {
    const hasToken = token && localStorage.getItem("token");
    const hasRole = role && localStorage.getItem("role");
    return !!(hasToken && hasRole);
  };
  
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
      isAuthenticated: isAuthenticated(), // Call the function
      notification,
      showNotification,
      hideNotification
    }),
    [
      isMobile,
      isTablet,
      drawerOpen,
      role,
      id,
      name,
      selected,
      token,
      classId,
      notification
    ]
  );
  
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;