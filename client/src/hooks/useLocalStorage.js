import { useState } from "react";

/**
 * a custom hook to return values from local storage as a state variables
 * @param {String} keyName       the name of the key in localstorage
 * @param {Object} defaultValue  value to store in localstorage 
 * @returns a wrapped version of useState functions
 */
export const useLocalStorage = (keyName, defaultValue) => {

/**
 * initialise state with existing value from localStorage if exists
 */
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);      
      if (value) {

        //return parsed value 
        return JSON.parse(value); 

      } else {

        //store object as string in localstorage   
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));    
        return defaultValue;
        
      }
    } catch (err) {
      return defaultValue;
    }
  });

  //updates localstorage and state with new value
  const setValue = (newValue) => {

    try {

      if(!newValue){
        remove();
      }

      window.localStorage.setItem(keyName, JSON.stringify(newValue));

    } catch (err) {}
    setStoredValue(newValue);
  };

  //if new value is null, remove key from local storage
  const remove = () => {
    try {
      window.localStorage.removeItem(keyName);
    } catch (err) {}
    return null;
  };
  
  return [storedValue, setValue];
};
