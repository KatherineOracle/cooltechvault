/** Express Controller providing division related methods
 *
 * @module controllers/loginController
 * @requires UserModel
 * @requires jwt
 */
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.js");

/**
 * @function handleLogin Method to authenticate a user and 
 * respond with user object, an access token, and refreshToken cookie
 * @param req {Object} The request.
 * @param res {Object} The response.
 */
const handleLogin = async (req, res) => {

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({ message: "Please supply an email and password." });


  try {

    //try to find user with matching email
    let user = await UserModel.findOne({ email: email }).exec();

    //respond now if the password does not match
    if (!user || !user.comparePassword(password)) {
      return res
        .status(401)
        .send({ message: "Authentication failed. Invalid user or password." });
    }

    //payload will be used to create acccess token
    payload = {
      id: user._id,
    };

    //user profile useful for frontend
    userData = {
      id: user._id,
      realName: user.realName,
      email: user.email,
      role: user.role,
      divisions: user.divisions,
    };

    const tokenExpiry = Date.now() + 1 * 15 * 60 * 1000; // 15minutes

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      SameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    //successfull response
    res.status(200)
      .send({
        user: userData,
        token: token,
        tokenExpiry: tokenExpiry,
        message: "Login succcessful",
      });

  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Could not find user. Please register" });
  }
};

module.exports = { handleLogin };
