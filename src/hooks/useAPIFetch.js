
import useAuth  from './useAuth'; 
import useToasts  from './useToasts'; 

/**
 * 
 * @returns custom hook useAPIFetch
 */



const useAPIFetch = () => {

  const {accessToken, login} = useAuth();
  const {addToast} = useToasts();



  // Extending Javascript error because some error handling  
  // requires the status code and a message when handling errors
  class APIError extends Error {
    constructor(code, message) {
      super(message); 
      this.code = code; 
    }
  }


/**
 * Gracefully handles all fetch requests and API errors.
 * @function fetchData
 * @param {String} url      API endpoint 
 * @param {Object} options {method, isProtected, body}
 * @returns {Object} data object or error object 
 */  
  const fetchData = async (url, options) => {

    let token = "";
    let tokenExpiry = "";


    // the request will needs an access token - make sure all is in order with it  
    if(options.isProtected){

      //get access token and expiry date
      if(accessToken){
        token = accessToken.token;
        tokenExpiry = accessToken.tokenExpiry;
      }  

      //if the token expiry has passed or will do in 5 seconds, try a silent login
      if(Date.now()+5000 > tokenExpiry || !tokenExpiry ){
        login(null, true);
      }  
    }  

    // prepare the request options  
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      method: options.method,
      body: JSON.stringify(options.body),
    };
    
    if(options.isProtected){
      requestOptions.headers.Authorization = `Bearer ${token}`;      
    }


    //Ready to call the API
    try{
      const response = await fetch(process.env.REACT_APP_API_BASE+url, requestOptions);

      //not sure if we'll get json so get response as text first
      let data = await response.text() || "";


      try{
        //see if we can parse it
        data = JSON.parse(data);
        
      } catch (e){
        //can't parse as json, so we have a plain text message
        data = {message: data};
      }

      //throw our custom error so we can handle errors by status code
      if(response.status >= 500){
        throw new APIError(response.status, data.message);
      }

      // we made it, return data object  
      return data;


    } catch (error) {

      // revise the message if the code is greater or equal to 500 
      if(error.message >= 500){
        error.code = 500;
        error.message = "Server or network problem."
      }
        
      // inform the user that soemthing went wrong with a toast
        addToast({title: "Error", 
        variant: 'danger', 
        message: error.message});

      // the calling component might want to do something more with the error, so return it.  
        return {error: true, code: error.code, message: error.message}
        
    }
   
  }

  return fetchData;
  
};



export default useAPIFetch;
