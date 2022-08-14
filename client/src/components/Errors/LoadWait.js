import React from "react";
import "./Loader.css";

/**
 * Displays loading bar if we are waiting for API Fetch or 
 * an error message if somehting went wrong with the API request
 * @returns {React.ReactElement}
 */
const LoadWait = ( { loading, error } ) => {

    if(loading) return <div className="bar"><div className="loader"></div></div>

    if(error) return <div>

        <h2>{error.message}</h2>
        {
         (error.code === 403) && <p>Well this is rather awkward. If you think you should have access, please contact your <a href={`mailto:${process.env.REACT_APP_ADMIN_EMAIL}`}>administrator</a>.</p>
        }
        { 
         (error.code === 404) && <p>I couldn't find that information for you. Please contact your <a href={`mailto:${process.env.REACT_APP_ADMIN_EMAIL}`}>administrator</a> for assistance.</p>
        }

        </div>


}

export default LoadWait;