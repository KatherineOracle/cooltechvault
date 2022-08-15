import React, {createContext, useState} from 'react';

let initialToasts = [];

//initilise context
const ToastContext = createContext({});

/**
 * Provides global access to array of toasts and methods to add and delete toasts.
 * 
 * @param {*} children  all the components wrapped in the toast provider 
 * @returns React.CreateContext.Provider
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState(initialToasts);

const deleteToast = (toastId) => {
    const updatedToasts = [...initialToasts].filter(tst => tst.id !== toastId);   
    initialToasts =  [...updatedToasts];
    setToasts([...initialToasts]);
}

const addToast = (newToast, delay = 3000) => {
    const updatedToasts = [...initialToasts];
    const newToastId = (updatedToasts.length > 0)? updatedToasts[0].id + 1 : 1;
    newToast.id = newToastId;
    updatedToasts.unshift(newToast);
    initialToasts = [...updatedToasts];
    setToasts([...initialToasts])
    setTimeout(() => {
      deleteToast(newToastId);
    }, delay);
}  


  return (
      <ToastContext.Provider value={{ toasts, deleteToast, addToast}}>
          {children}
      </ToastContext.Provider>
  )
}

export default ToastContext;
