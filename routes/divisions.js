/** Express router providing divisions related routes
 * @module routes/divisions
 * @requires express
*/
const express = require("express");
const router = express.Router();
const divisionsController = require("../controllers/divisionsController.js");

/**
 * @method get/divisions Method serving find all divisions
 * @method post/divisions  @returns 405
 * @method put/divisions  Method serving update all divisions
 * @method delete/divisions @returns 405
*/
router
  .route("/")
  .get(divisionsController.handleFindAllDivisions)
  .post((req, res) => {
    res.sendStatus(405);
  })
  .put(divisionsController.handleUpdateAllDivisions)
  .delete((req, res) => {
    res.sendStatus(405);
  });

module.exports = router;
