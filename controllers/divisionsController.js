/** Express Controller providing division related methods
 * 
 * @module controllers/divisionsController
 * @requires DivisionModel
 */
const DivisionModel = require("../models/Division.js");


/** 
 * @function handleFindAllDivisions Method to return all divisions
 * @param req {Object} The request.
 * @param res {Object} The response.
*/
const handleFindAllDivisions = async (req, res) => {

  try {
    const divisions = await DivisionModel.find();

    res.status(200).send({ divisions: divisions });
  } catch (err) {
    res.status(400).send({ message: "Could not find divisions" });
  }
};

/** 
 * @function handleUpdateAllDivisions Method to update all divisions
 * @param req {Object} The request.
 * @param res {Object} The response.
*/
const handleUpdateAllDivisions = async (req, res) => {

  if(!req.body) return res.status(400).send({ message: "No data" });

  try {

    //bulk update divisions, creating new departments if they don't exist
    await DivisionModel.bulkWrite(
      req.body.map((doc) => ({
        updateOne: {
          filter: { _id: doc._id },
          update: doc,
          upsert: true,
          new: true,
        },
      }))
    );

    //find all divisions after update
    const divisions = await DivisionModel.find();

    //return updated divisions
    res.status(200).send({divisions: divisions, message: "Divisions updated" });

  } catch (err) {

    res
      .status(400)
      .send({ message: "An error occurred while updating divisions" });
  }
};

module.exports = {
  handleFindAllDivisions,
  handleUpdateAllDivisions,
};

