/** Express router providing credentials related routes
 * @module routes/divisions
 * @requires express
*/
const express = require("express");
const router = express.Router();
const credentialsController = require("../controllers/credentialsController.js");
const verifyDepartment = require('../middleware/verifyDepartment');


/**
*
* @method get/credentials/:department Method serving list all credentials for a department
* @param {callback} verifyDepartment Middleware to check that user has access to department.
* 
* @method post/divisions  @returns 405
* @method put/divisions  @returns 405
* @method delete/divisions @returns 405
* 
*/
router.route('/:department')
    .get(verifyDepartment, credentialsController.handleFindCredentials)
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