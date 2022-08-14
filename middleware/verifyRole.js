
/**
 * Verifies the user role 
 * @module verifyRole
 * @function verifyToken
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
const verifyRole = (role) => {
  return function(req, res, next) {

    /*map the string-based roles to numerical 
    * values to have a heirarchy 
    */
    const authMap = {
      "guest": 0,
      "employee": 1,
      "manager": 2,
      "administrator": 3
    }  

    //test if role is too low to continue
    if (authMap[req.user.role] < authMap[role]) {

      return res.status(403).send("Insufficient authority.");
    }

    return next();
  };
}

module.exports = verifyRole;