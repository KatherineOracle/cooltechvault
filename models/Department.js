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

module.exports = mongoose.model('Departments', departmentSchema);
