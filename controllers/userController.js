/** Express Controller providing user methods
 *
 * @module controllers/userController
 * @requires UserModel
 * @requires DivisionModel
 */
const UserModel = require("../models/User.js");
const DivisionModel = require("../models/Division.js");

/**
 * @function handleFindAllUsers Method to fetch all user, by parameter eg. role
 * @param req {Object} The request.
 * @param res {Object} The response.
 */
const handleFindAllUsers = async (req, res) => {
  let params = req.body;

  try {
    //fetch all users with matching parameters
    const users = await UserModel.find({ ...params }).exec();

    //success response with usres
    res.status(200).send({ users: users });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Could not find users" });
  }
};

/**
 * @function handleFindUser Method to fetch user with matching id, and associated division structure
 * @param req {Object} The request.
 * @param res {Object} The response.
 */
const handleFindUser = async (req, res) => {
  const userId = req.params.id || req.user.id; //profile route will send user from accesstoken

  try {
    //get all divisions
    const divisions = await DivisionModel.find();

    //get matching user, without password property
    const user = await UserModel.findOne({ _id: userId }, "-password").exec();

    let realdeps = [];
    //loop through all divisions setting departments that do not match user's departments to null
    divisions.map((div, ind) => {
      div.departments.map((dep, idx) => {
        if (user.departments.indexOf(dep._id) === -1) {
          div.departments[idx] = null;
        }
      });
      //filter out all the nulls in the division
      let filtered = div.departments.filter(function (el) {
        return el != null;
      });

      // if the division has any departments left push to realdeps array
      if (filtered.length > 0) {
        div.departments = [...filtered];
        realdeps.push(div);
      }
    });

    //respond with user and clean division structure
    res.status(200).send({ user: user, departments: [...realdeps] });
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "Could not find user" });
  }
};

/**
 * @function handleCreateUser Method to create a new user
 * @param req {Object} The request.
 * @param res {Object} The response.
 */
const handleCreateUser = async (req, res) => {
  if (!req.body) return res.status(400).send({ message: "No data" });

  try {
    //save the user
    const user = await UserModel.create({ ...req.body });

    //return successful response with new user object
    res.status(200).send({ user: user, message: "User successfully updated" });
  } catch (err) {
    res.status(400).send({ message: "User creation failed" });
  }
};

/**
 * @function handleUpdateUser Method to update existing user
 * @param req {Object} The request.
 * @param res {Object} The response.
 */
const handleUpdateUser = async (req, res) => {
  const userId = req.params.id || req.user.id; //profile route will send user from accesstoken

  if (!req.body) return res.status(400).send({ message: "No data" });

  try {
    //save the user and return updated object
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { ...req.body } },
      { new: true }
    );

    //send success response and updated user object
    res.status(200).send({ user: user, message: "User successfully updated" });
  } catch (err) {
    res.status(400).send({ message: "User update failed" });
  }
};

/**
 * @function handleDeleteUser Method to delete existing user
 * @param req {Object} The request.
 * @param res {Object} The response.
 */
const handleDeleteUser = async (req, res) => {
  if (!req.params.id) res.status(400).send({ message: "User deletion failed" });

  try {
    //delete user with matching id
    await UserModel.deleteOne({ _id: req.params.id });

    //send success response
    res.status(200).send({ message: "User deleted" });
  } catch (err) {
    res.status(400).send({ message: "User deletion failed" });
  }
};

module.exports = {
  handleUpdateUser,
  handleFindUser,
  handleFindAllUsers,
  handleDeleteUser,
  handleCreateUser,
};
