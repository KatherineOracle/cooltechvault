/** Express router providing root related routes
 * @module routes/root
 * @requires express
 */
const express = require('express');
const router = express.Router();

/**
 * @method get/ @returns 405
 * @method post/ @returns 405
 * @method put/ @returns 405
 * @method delete/ @returns 405
 */
router.route('/')
    .get((req, res) => {
        res.status(405).send();
    })
    .post((req, res) => {
        res.status(405).send();
    }) 
    .put((req, res) => {
        res.status(405).send();
    })  
    .delete((req, res) => {
        res.status(405).send();
    })  


module.exports = router;    