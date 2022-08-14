

/**
 * Verifies the user has access to department 
 * @module verifyRole
 * @function verifyToken
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */

const verifyDepartment = async (req, res, next) => {

    const selecteddepartment = req.params.department;
    const user = req.user

    //only test if role is below administrator 
    if(req.user.role !== "administrator"){
        
        //look for department index in user departments
        const hasIndex = user.departments.indexOf(selecteddepartment);

        //department not found
        if(hasIndex === -1){
              return res.status(403).send("You are not authorised to access this department"); 
        }
    }

    //all clear to continue
    return next();  
};

module.exports = verifyDepartment;