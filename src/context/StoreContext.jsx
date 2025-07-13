import { createContext, useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material"; 

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const isMobile = useMediaQuery("(max-width:600px)");
    const isTablet = useMediaQuery("(max-width:900px)");

    // const [id, setId] = useState('STU031');
    const [studentId, setStudentId] = useState('STU050');
    const [classId, setClassId] = useState('CLS001');
    const [name, setName] = useState('W.K.T.P.Kularathna');

    const [selected, setSelected] = useState("");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    // Notification state
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info', // 'error', 'warning', 'info', 'success'
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

    // const [role, setRole] = useState("Student")
    const [role, setRole] = useState("Admin")
    // const [role, setRole] = useState("Teacher")

    const contextValue = {
        isMobile,
        isTablet,
        drawerOpen,
        setDrawerOpen,
        toggleDrawer,
        role,
        setRole,
        studentId,
        setStudentId,
        name,
        setName,
        selected,
        setSelected,
        classId,
        setClassId,
        // Add notification context
        notification,
        showNotification,
        hideNotification
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;