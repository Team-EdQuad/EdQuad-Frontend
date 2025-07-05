import { createContext, useMemo, useState } from "react";
import { useMediaQuery } from "@mui/material";
const Url = import.meta.env.VITE_BACKEND_URL

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
  const [email, setEmail] = useState(() => localStorage.getItem("email") || null);

  const [selected, setSelected] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen((open) => !open);

  // Login: set state and localStorage
    const login = ({ token, role, id, name, classId, email }) => {
    setToken(token);
    setRole(role);
    setId(id);
    setName(name);
    setClassId(classId);
    setEmail(email);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    if (classId) {
        localStorage.setItem("classId", classId);
    } else {
        localStorage.removeItem("classId");
    }
    };


  // Logout: clear state and localStorage
  
// const logout = () => {
//   setToken(null);
//   setRole(null);
//   setId(null);
//   setName(null);
//   setClassId(null);
//   localStorage.clear();
// };

console.log("Logging out:", { id, role, token, name, email });


const logout = async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");

  try {
    const res = await fetch(`${Url}/api/user-management/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`,
      },
      body: new URLSearchParams({
        user_id: id,
        role: role,
      }),
    });

    const data = await res.json();
    console.log("Logout response:", data);
  } catch (e) {
    console.error("Logout API error", e);
  }

  // Now clear
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
      email,
      setEmail,
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
