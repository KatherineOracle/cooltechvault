import Stack from "react-bootstrap/stack";
import ToastItem from "./ToastItem";
import useToasts from '../../hooks/useToasts';
import "./ToastStack.css";

/**
 * Displays List of toasts from the global toastContext.
 * 
 * @returns {React.ReactElement}
*/
export default function ToastStack() {
  const { toasts } = useToasts();

    return (

        <Stack className="toastStack" gap={3}>
            {toasts.map((toast) => {
               return <ToastItem key={toast.id} toast={toast} />
            })}
            
        </Stack>   
    )

};

