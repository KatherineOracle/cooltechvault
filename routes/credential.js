/** Express router providing single credential related routes
 * @module routes/credential
 * @requires express
 */
const express = require("express");
const router = express.Router();
const credentialsController = require("../controllers/credentialsController.js");
const verifyDepartment = require('../middleware/verifyDepartment');
const verifyRole = require('../middleware/verifyRole');
const app = express();


/**
* @param {callback} verifyDepartment Middleware to first check that user has access to department.
*/
app.use(verifyDepartment);

/**
* @method get/credential @returns 405 
* 
* @method post/credential Method serves function to create new credential
* @param {callback} verifyRole Middleware to first check that user has min role of manager.
* 
* @method put/credential  @returns 405
* @method delete/credential @returns 405
* 
*/
router
  .route("/")
  .get((req, res) => {
    res.sendStatus(405);
  })
  .post(verifyRole("manager"), credentialsController.handleCreateCredential)
  .put((req, res) => {
    res.sendStatus(405);
  })
  .delete((req, res) => {
    res.sendStatus(405);
  });

/**
* @method get/credential/:id Method serves function to retrieve credential
* 
* @method post/credential/:id @returns 405
* 
* @method put/credential/:id  Method serves function to update a credential
* @param {callback} verifyRole Middleware to first check that user has min role of administrator.

* @method delete/credential/:id Method serves function to delete a credential
* @param {callback} verifyRole Middleware to first check that user has min role of administrator.
*/  
router
  .route("/:id")
  .get(credentialsController.handleFindCredential)
  .post((req, res) => {
    res.sendStatus(405);
  })
  .put(verifyRole("administrator"), credentialsController.handleUpdateCredential)
  .delete(verifyRole("administrator"), credentialsController.handleDeleteCredential);


/**
* @method get/credential/password/:id Method serves function to retrieve credential password
* @method post/credential/password/:id @returns 405
* @method put/credential/password/:id  @returns 405
* @method delete/credential/password/:id @returns 405
*/  
router
  .route("/password/:id")
  .get(credentialsController.handleFindCredentialPassword)
  .post((req, res) => {
    res.sendStatus(405);
  })
  .put((req, res) => {
    res.sendStatus(405);
  })
  .delete((req, res) => {
    res.sendStatus(405);
  });

module.exports = router;
