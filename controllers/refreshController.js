/** Express Controller providing refresh token methods
 *
 * @module controllers/refreshController
 * @requires UserModel
 * @requires jwt
 */

const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.js");


const handleRefresh = async (req, res) => {

    const cookies = req.cookies;
    if(!cookies || !cookies.refreshToken) return res.status(401).send({message: "No refresh Token sent"});

    //verify token

    try {
        const decoded = jwt.verify(cookies.refreshToken, process.env.TOKEN_SECRET);

        if(!decoded) return res.sendStatus(403);

        //check for user is in db
        let user = await UserModel.findOne({ _id: decoded.id }).exec();
        
        if(!user) return res.sendStatus(403);

        payload = {
            id: user._id
        };

        userData = {
            id: user._id,
            email: user.email,
            role: user.role,
            divisions: user.divisions
        };      

        const tokenExpiry = Date.now()+(1*15*60*1000); // 15minutes
        //create fresh accessToken
        const token = jwt.sign(
            payload, 
            process.env.TOKEN_SECRET, 
            { expiresIn: "1h" }
        );

        //send fresh accessToken and userdata
        res.status(200).send({user: userData, token: token, tokenExpiry: tokenExpiry});   
    
    } catch (err) {
        console.log(err);
        //refresh token probably expired;
        res.sendStatus(410);
    }

  };

  module.exports = { handleRefresh }
