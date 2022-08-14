/** Express router providing user register related routes
 * @module routes/register
 * @requires express
 */
const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController.js');

/**
 * @method get/register @returns 405
 * @method post/register Method serving new user registration
 * @method put/register @returns 405
 * @method delete/register @returns 405
 */
router.route('/')
    .get((req, res) => {
        res.sendStatus(405);
    })
    .post(registerController.handleRegister) 
    .put((req, res) => {
        res.sendStatus(405);
    })     
    .delete((req, res) => {
        res.sendStatus(405);
    })  

module.exports = router;    