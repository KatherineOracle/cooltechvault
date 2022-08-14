
/** Express Controller providing refresh token methods
 *
 * @module controllers/logoutController
 */

/**
 * @function handleLogout Method to clear the refreshToken cookie
 * @param req {Object} The request.
 * @param res {Object} The response.
 */

const handleLogout = (req, res) => {
    
    //front end should also handle clearing of accessToken    
    const cookies = req.cookies;
    if (!cookies || !cookies.refreshToken) return res.sendStatus(204); //No content

    //clear refresh token 
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);

}

module.exports = {handleLogout}