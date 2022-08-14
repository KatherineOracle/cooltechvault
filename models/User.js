
/**
 * The data-layer for a user
 * @module models
 * @requires mongoose
 * @requires bcrypt
 */
const mongoose = require('mongoose')
   ,Schema = mongoose.Schema;
const bcrypt = require("bcryptjs")   

/**
 * userSchema schema
 * @constructor userSchema
 */
const userSchema = new Schema({
    createdOn: {type: Date, default: Date.now},
    updatedOn: {type: Date},
    deletedOn: {type: Date},
    realName: {type: String},
    email: {type: String, unique: true, required : true},
    password: {type: String, min: [8, 'At least 8 characters please'], required : true},
    departments: [{ type: Schema.Types.ObjectId, ref:'Department' }],
    role: {type: String},
}, { collection: "Users" });

/**
 * Helper method to hash user password role
 * @function newPasswordHash
 * @param {Object} user
 * @param {callback} next 
 * @returns {callback} next 
 */
const newPasswordHash = (user, next) => {
  bcrypt.genSalt(10, function (saltError, salt) {
    if (saltError) {
      return next(saltError)
    } else {
      bcrypt.hash(user.password, salt, function(hashError, hash) {
        if (hashError) {
          return next(hashError)
        }  
        user.password = hash
        next()
      })
    }
  })
}

/**
 * Pre save hook to get hashedpassword
 * @param {callback} next 
 * @returns {callback} next 
 */
userSchema.pre("save", function (next) {
    const user = this;
    if (this.isModified("password") || this.isNew) {
      newPasswordHash(user, next);
    } else {
      return next()
    }
  })

/**
 * Pre findOneAndUpdate hook to get hashedpassword
 * @param {callback} next 
 * @returns {callback} next 
 */  
  userSchema.pre("findOneAndUpdate", function (next) {
    const user = this._update.$set;  
    if (user.password) {
        newPasswordHash(user, next);
    } else {
      return next()
    }
  })

/**
 * Helper function to compare passowrd
 * @function comparePassword
 * @returns {Boolean} 
 */  
  userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

module.exports = mongoose.model('Users', userSchema);
