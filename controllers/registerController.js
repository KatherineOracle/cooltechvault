/** Express Controller providing user registration method
 *
 * @module controllers/registerController
 * @requires UserModel
*/
const UserModel = require("../models/User.js");

/**
 * @function handleRegister Method to register a new user
 * @param req {Object} The request.
 * @param res {Object} The response.
 */
const handleRegister = async (req, res) => {

    const {email, password, realName} = req.body;
    if (!email || !password) return res.status(400).send("Please supply an email and password."); 

    try {

      //construct newUser as per schema
      const newUser = new UserModel({
        realName: realName, 
        email: email,        
        password: password,
        departments: [],
        role: "guest",
      });

      //save user
      await newUser.save();

      //send success response
      res.status(200).send("You are registered, an administrator will authorise your access shortly.");

    } catch (err) {

      //Mongoose Schema will send a 11000 if the user already exists
      if(err.code === 11000){
        return res.status(409).send("User already exists.");
      }
      //something else went wrong
      if(err.code != 11000){
        return res.status(409).send("Could not create new account.");
      }  

      
  };
}
module.exports = { handleRegister }
