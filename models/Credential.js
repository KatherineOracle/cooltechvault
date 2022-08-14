/**
 * The data-layer for a credential
 * @module models
 * @requires mongoose
 * @requires crypto
 */
const mongoose = require('mongoose')
   ,Schema = mongoose.Schema;
const {createCipheriv, createDecipheriv} = require ("crypto");
const key = process.env.CRYPTO_KEY;
const iv = process.env.CRYPTO_IV;

/**
 * credential schema
 * @constructor credentialSchema
 */ 
const credentialSchema = new Schema({
    createdOn: {type: Date, default: Date.now},
    updatedOn: {type: Date},
    deletedOn: {type: Date},
    platform: {type: String},
    url: {type: String},
    username: {type: String},
    password: {type: String},
    department: {type: String},
}, { collection: "Credentials" });

/**
 * Helper method to encrypt credential password
 * @function createPasswordCipher
 * @param {String} password
 * @returns {String} encryptedPassword 
 */
 const createPasswordCipher = (password) => {
  const cipher = createCipheriv('aes256', key, iv); 
  const encryptedPassword = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
  return encryptedPassword;
}

/**
 * Helper method to return decrypted credential password
 * @function decryptPassword
 * @returns {String} decryptedPassword 
 */  
 credentialSchema.methods.decryptPassword = function() { 
  const decipher = createDecipheriv('aes256', key, iv);     
  const decryptedPassword = decipher.update(this.password, 'hex', 'utf-8') + decipher.final('utf8');   
  return decryptedPassword;
};

/**
 * Pre save hook to encrypt password
 * @param {callback} next 
 * @returns {callback} next 
 */
credentialSchema.pre("save", function (next) {
    const credential = this;  
    if (credential.isModified("password") || credential.isNew) {
      credential.password = createPasswordCipher(credential.password)
      next()
    } else {
      return next();
    }
  })

/**
 * Pre findOneAndUpdate hook to encrypt password
 * @param {callback} next 
 * @returns {callback} next 
 */  
  credentialSchema.pre("findOneAndUpdate", function (next) {    
    const credential = this._update.$set;  
    if (credential.password) {       
      credential.password = createPasswordCipher(credential.password) 
      next()
    } else {
      return next()
    }
  })  


module.exports = mongoose.model('Credential', credentialSchema);