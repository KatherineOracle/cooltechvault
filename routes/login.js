/** Express router providing login related routes
 * @module routes/login
 * @requires express
*/
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController.js')

/**
 * @method get/logout @returns 405
 * @method post/logout  Method serving login function
 * @method put/logout  @returns 405
 * @method delete/logout @returns 405
*/
router.route('/')
    .get((req, res) => {
        res.sendStatus(405);
    })
    .post(loginController.handleLogin) 
    .put((req, res) => {
        res.sendStatus(405);
    })  
    .delete((req, res) => {
        res.sendStatus(405);
    })  

module.exports = router;    