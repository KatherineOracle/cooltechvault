/** Express router providing users related routes
 * @module routes/users
 * @requires express
 */
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

/**
 * @method get/users @returns 405
 * @method post/users Method serving find users
 * @method put/user @returns 405
 * @method delete/user @returns 405
 */
router
  .route("/")
  .get((req, res) => {
    res.sendStatus(405);
  })
  .post(userController.handleFindAllUsers)
  .put((req, res) => {
    res.sendStatus(405);
  })
  .delete((req, res) => {
    res.sendStatus(405);
  });


module.exports = router;
