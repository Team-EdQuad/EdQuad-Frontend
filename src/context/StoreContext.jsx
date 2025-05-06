import { createContext, useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material"; 

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const isMobile = useMediaQuery("(max-width:600px)");
    const isTablet = useMediaQuery("(max-width:900px)");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
      };

    const [role, setRole] = useState("Student")
    


    const contextValue = {
        isMobile,
        isTablet,
        drawerOpen,
        setDrawerOpen,
        toggleDrawer,
        role,
        setRole,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;