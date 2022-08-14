/** Express Controller providing credential related methods
 * 
 * @module controllers/credentialController
 * @requires CredentialModel
 */
const CredentialModel = require("../models/Credential.js");

/** 
 * @function handleCreateCredential Method to add a credential to the database
 * @param req {Object} The request.
 * @param res {Object} The response.
*/
const handleCreateCredential = async (req, res) => {
  
  if (!req.body) return res.status(400).send({ message: "No data" });
  
  try{
  //create the credential  
  await CredentialModel.create({...req.body});

  //fetch all credentials for department, without passwords!!
  let credentials = await CredentialModel.find({ department: req.body.department }, "-password").exec();
  
  //return credentials
  res.status(200).send({credentials: credentials, message: "New credential stored"});

  } catch (err){
    console.log(err);
    res.status(404).send({message: "Could not create credential"});
  }
};

/** 
 * @function handleFindCredential Method to find a credential in the database
 * @param req {Object} The request.
 * @param res {Object} The response.
*/
const handleFindCredential = async (req, res) => {

  const credentialId = req.params.id;

  try {
    let credential = await CredentialModel.findOne({ _id: credentialId }).exec();

    res.status(200).send({credential: credential});

  } catch (err) {

    res.status(404).send({message: "Could not find credential"});
  }

};

/** 
 * @function handleFindCredentialPassword Method to return the password of a single credential
 * @param req {Object} The request.
 * @param res {Object} The response.
*/
const handleFindCredentialPassword = async (req, res) => {

  const credentialId = req.params.id;

  try {

    //find the credential
    let credential = await CredentialModel.findOne({ _id: credentialId }).exec();

    //decrypt the password
    let decryptedPassword = await credential.decryptPassword();

    //return password
    res.status(200).send({password: decryptedPassword});

  } catch (err) {

    res.status(404).send({message: "Could not retrieve credential password"});
  }

};

/** 
 * @function handleFindCredentials Method to return all credentials for a department
 * @param req {Object} The request.
 * @param res {Object} The response.
*/
const handleFindCredentials = async (req, res) => {

  const departmentId = req.params.department;

  try {

    //get all credentials, without the password property
    let credentials = await CredentialModel.find({ department: departmentId }, "-password").exec();

    //return credentials
    res.status(200).send({credentials: credentials});

  } catch (err) {

    res.status(404).send({message: "Could not find credentials"});
  }
};

/** 
 * @function handleUpdateCredential Method to update a single credential
 * @param req {Object} The request.
 * @param res {Object} The response.
*/
const handleUpdateCredential =  async (req, res) => {

  const credentialId = req.params.id;
  if (!req.body) return res.status(400).send({ message: "No data" });

  try {

    //update single credential 
    await CredentialModel.findByIdAndUpdate(
      credentialId,
      { $set: { ...req.body } }
    );

    //find all credentials for same department 
    let credentials = await CredentialModel.find({ department: req.body.department }, "-password").exec();

    //return credentials
    res.status(200).send({ credentials: credentials, message: "Credential updated" });

  } catch (err) {
    res.status(400).send({ message: "Credential update failed" });
  }

};

/** 
 * @function handleDeleteCredential Method to update a delete a single credential
 * @param req {Object} The request.
 * @param res {Object} The response.
*/
const handleDeleteCredential = async (req, res) => {

  if (!req.params.id) res.status(400).send({ message: "No id to delete provided" });
  
  try{
   //delete credential 
   await CredentialModel.deleteOne({ _id: req.params.id });

   //find all credentials for same department 
   let credentials = await CredentialModel.find({ department: req.body.department }, "-password").exec();  
  
   //return credentials
   res.status(200)
      .send({ credentials: credentials, message: "Credential deleted" });

  } catch (err){
    res.status(400).send({ message: "Credential deletion failed" });
  }
};

module.exports = {
  handleCreateCredential,
  handleFindCredential,
  handleFindCredentials,
  handleUpdateCredential,
  handleDeleteCredential,
  handleFindCredentialPassword
};
