/** Express router providing user related routes
 * @module routes/user
 * @requires express
 */
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

/**
 * @method get/user @returns 405
 * @method post/user Method serving new user creation
 * @method put/user @returns 405
 * @method delete/user @returns 405
 */
router
  .route("/")
  .get((req, res) => {
    res.sendStatus(405);
  })
  .post(userController.handleCreateUser)
  .put((req, res) => {
    res.sendStatus(405);
  })
  .delete((req, res) => {
    res.sendStatus(405);
  });

/**
 * @method get/user/:id Method serving find user
 * @method post/user/:id @returns 405
 * @method put/user/:id Method serving user update
 * @method delete/user/:id Method serving user deletion
 */
router
  .route("/:id")
  .get(userController.handleFindUser)
  .post((req, res) => {
    res.sendStatus(405);
  })
  .put(userController.handleUpdateUser)
  .delete(userController.handleDeleteUser);

module.exports = router;
