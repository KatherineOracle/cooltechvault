import { createContext } from "react";
import useToasts from "../hooks/useToasts";
import { useNavigate } from "react-router-dom";
import useAPIFetch from "../hooks/useAPIFetch";
import { useLocalStorage } from "../hooks/useLocalStorage";

/** map string based roles to a numerica value so we can have a heirarchy  */
const authMap = {
  guest: 0,
  employee: 1,
  manager: 2,
  administrator: 3,
};

// used to log user our automatically 5s before the accessToken expires
const setTimer = (expiryTime, action) => {
  let timer = null;
  if (!expiryTime) return clearTimeout(timer);
  let timerMSecs = new Date(expiryTime) - Date.now() - 5000;
  timer = setTimeout(action, timerMSecs);
};

/** initialise context */
const AuthContext = createContext({});

/**
 * Provides global access to the logged in user, access token and related auth methods.
 * 
 * @param {*} children  all child components wrapped by the context provider. 
 * @returns React.createContext.Provider
 */
export const AuthProvider = ({ children }) => {

  const { addToast } = useToasts();
  const navigate = useNavigate();
  const fetchData = useAPIFetch();

  const [user, setUser] = useLocalStorage("user", null);
  const [accessToken, setAccessToken] = useLocalStorage("token", null);

/**
 * 
 * @function Login
 * @param {Object} body     username and password
 * @param {Boolean} silent  refreshtoken login is silent, manual login is not silent
 * @param {*} from          The previous page - the login component will send this if we need to try return there
 */
  const login = async (body = null, silent=false, from = '/') => {
    try {
      let data = {};      
      if(!silent){
        //manual login using the login form
        data = await fetchData("/login", {
          isProtected: false,
          method: "POST",
          body: body,
        });             
      } else {
        //silent login using the refresh token 
        data = await fetchData("/refresh", {
          isProtected: false,
          method: "GET"
        });
      }

      if (data.error) throw Error(data.message);

      //both login methods must update our user state and reset logout timer 
      setUser({ ...data.user });
      setAccessToken({ token: data.token, tokenExpiry: data.tokenExpiry });
      setTimer(data.tokenExpiry, logout);
      
      if(!silent){
        //user logged in manually so we can say hi
        addToast({
          title: "Hello!",
          variant: "Success",
          message: data.message,
        });

        /*if user tried to enter from a particular url, 
        * we can try send them back there right away.
        */
        navigate(from, { replace: true });

      }

    } catch (error) {

      // login failed. Use the logout function to reset state 
      console.log(error);
      logout(true);

    }
  };

  /**
   * Logs user out entirely and navigates to login route 
   * @function logout
   * @param {Boolean} silent - do we need to say good-bye or not
   */
  const logout = async (silent = false) => {    
    try {
      //clear all state variables and the refresh cookie  
      setUser(null);
      setAccessToken(null);
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";    
      setTimer(null);

      //inform API to delete the refresh cookie
      await fetchData("/logout", { isProtected: false, method: "GET" });

      //User manually logged out, so we must say good bye
      if (!silent) {
        addToast({
          title: "Good-bye",
          variant: "Warning",
          message: "You are logged out",
        });
      }
      
    } catch (error) {
      console.log(error.message);
    }
    
    //navigate user back to login
    navigate("/login", { replace: true });

  };

/**
 * @function hasPermissionLevel
 * @param {Number} number
 * @returns Boolean   
 */
  const hasPermissionLevel = (number) => {
    if (!user) return false;
    if (user) {
      return authMap[user.role] >= number;
    } else {
      return false;
    }
  };

  // prevent unneccessary rerenders of children with useMemo
  // const values = useMemo(
  //   () => ({
  //     ,
  //   }),
  //   [user, accessToken]
  // );

  return <AuthContext.Provider value={{user,
    accessToken,
    hasPermissionLevel,
    login,
    logout,
    authMap}}>{children}</AuthContext.Provider>;
};

export default AuthContext;
