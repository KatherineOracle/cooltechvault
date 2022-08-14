/** Express router providing logout related routes
 * @module routes/logout
 * @requires express
*/
const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');

/**
 * @method get/logout Method serving logout function
 * @method post/logout  @returns 405
 * @method put/logout  @returns 405
 * @method delete/logout @returns 405
*/
router.route('/')
    .get(logoutController.handleLogout)
    .post((req, res) => {
        res.sendStatus(405);
    }) 
    .put((req, res) => {
        res.sendStatus(405);
    })  
    .delete((req, res) => {
        res.sendStatus(405);
    })  


module.exports = router;