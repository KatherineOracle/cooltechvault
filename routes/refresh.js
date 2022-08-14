/** Express router providing refresh token related routes
 * @module routes/refresh
 * @requires express
 */
const express = require('express');
const router = express.Router();
const refreshController = require('../controllers/refreshController.js')

/**
 * @method get/register @returns 405
 * @method post/register Method serving new user registration
 * @method put/register @returns 405
 * @method delete/register @returns 405
 */
router.route('/')
    .get(refreshController.handleRefresh)
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
