import { useContext } from "react";
import ToastContext from "../context/ToastProvider";

/**
 * 
 * @returns a custom hook as wrapper for ToastContext 
 */
const useToasts = () => {

    return useContext(ToastContext);
}

export default useToasts;

