/**
 * Verifies the user access token 
 * @module verifyToken
 * @requires jwt
 * @requiers UserModel
 */
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.js");
const config = process.env;


/**
 * @function verifyToken
 * @param {Object & {user : Object}} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?req.headers["authorization"].split(" ")[1]:null;

  //no token
  if (!token) {
    return res.status(401).send("Please login again");
  }
  try {
    //decode token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);  
    
    //look for matching user in the database
    let user = await UserModel.findOne({ _id: decoded.id }).exec();
    
    //set req user for use in next functions
    req.user = user;

  } catch (err) {
       
    return res.status(404).send("User not found");
  }
  return next();
};

module.exports = verifyToken;