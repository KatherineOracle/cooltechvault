/** Express router providing logged-in user profile related routes
 * @module routes/profile
 * @requires express
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js')

/**
 * @method get/profile Method serving logged-in user profile
 * @method post/profile  @returns 405
 * @method put/profile Method serving updates to logged-in user
 * @method delete/profile @returns 405
 */
router.route('/')
    .get(
        userController.handleFindUser
    )
    .post((req, res) => {
        res.sendStatus(405);
    })
    .put(userController.handleUpdateUser
    )  
    .delete((req, res) => {
        res.sendStatus(405);
    })   
        
module.exports = router;        