import { createContext, useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material"; 

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const isMobile = useMediaQuery("(max-width:600px)");
    const isTablet = useMediaQuery("(max-width:900px)");

    const [id, setId] = useState('STU001');
    const [name, setName] = useState('W.K.T.P.Kularathna');

     const [selected, setSelected] = useState("Material Progress");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
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
        id,
        setId,
        name,
        setName,
        selected,
        setSelected
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;