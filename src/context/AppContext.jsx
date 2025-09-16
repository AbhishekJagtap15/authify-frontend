import { createContext, useEffect } from "react";
import { AppConstants } from "../util/constants";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;


    const backendURL = AppConstants.BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getUserData = async () => {
        try {
            const response = await axios.get(backendURL+'/profile');
            if (response.status === 200) {
                setUserData(response.data);
            }else{
                toast.error("Could not fetch user data.");
            }
        }catch (err) {
                toast.error(err.message);
            }
    }

    const getAuthState = async () => {
        try {
            const response = await axios.get(backendURL+'/is-authenticated');
            if (response.status === 200 && response.data===true) {
                setIsLoggedIn(true);
                await getUserData();
            }else{
                setIsLoggedIn(false);
            }
        }catch (err) {
                if(err.response){
                    const msg = err.response.data?.messagen|| "Authentication check failed.";
                    toast.error(msg);
                }else{
                    toast.error(err.message);
                }
                setIsLoggedIn(false);
            }
    }

    useEffect(() => {
        getAuthState();
    }, []);


    const contextValue = {
        backendURL,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData ,
        getUserData,
    
    }
        

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
}
    