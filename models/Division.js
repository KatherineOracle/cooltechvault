/**
 * The data-layer for a division
 * @module models
 * @requires mongoose
 */
const mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

/**
 * departmentSchema schema - a sub document model of division
 * @constructor departmentSchema
 */ 
const departmentSchema = new Schema({
 name: {type: String}
});

/**
 * divisionSchema schema
 * @constructor divisionSchema
 */
const divisionSchema = new Schema({
    createdOn: {type: Date, default: Date.now},
    updatedOn: {type: Date},
    deletedOn: {type: Date},
    unit: {type: String},
    departments: [departmentSchema],
}, { collection: "Divisions" });



    
module.exports = mongoose.model('Divisions', divisionSchema);
