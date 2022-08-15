import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
/**
 * 
 * @returns a custom hook as wrapper for AuthContext
 */
const useAuth = () => {

    return useContext(AuthContext);
}

export default useAuth;