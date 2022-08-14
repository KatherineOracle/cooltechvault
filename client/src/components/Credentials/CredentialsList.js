import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Col, Row, Container } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import Credential from "./Credential";
import CredentialNew from "./CredentialNew";
import useAPIFetch from "../../hooks/useAPIFetch";
import useToasts from "../../hooks/useToasts";
import LoadWait from "../Errors/LoadWait";

/**
 * Displays select boxes for available operating units and respective departments 
 * Displays a list of credentials once department selected.
 * Can be populated using url parameters 
 * @returns {React.ReactElement}
*/
const CredentialsList = () => {
  const { hasPermissionLevel } = useAuth();
  const { division, department } = useParams();
  const navigate = useNavigate();
  const fetchData = useAPIFetch();
  const { addToast } = useToasts();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [divisions, setDivisions] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(division);
  const [selectedDepartment, setSelectedDepartment] = useState(department);
  const [credentialList, setCredentialList] = useState(null);

  /**
   * On inital component load
   */
  useEffect(() => {
    if (!divisions) getDivisions();
  }, []);

  /**
   * Listen for changes to selectedDivision state
   * 
   * if the user selects a division from the available list
   * then we can update the departments state 
  */
  useEffect(() => {
    if(!selectedDivision) {
      setSelectedDepartment(undefined);
    }
    if (divisions !== null) {
      let sdidx = divisions.findIndex((div) => {
        return div._id === selectedDivision;
      });

      if (sdidx > -1) setDepartments([...divisions[sdidx].departments]);
    }
  }, [selectedDivision, divisions]);

  /**
   * Listen for changes to selectedDepartment state
   * 
   * if the user selects a department from the available list
   * and it there wasn't a fetch error (unauthorised) on initial load
   * then we can get the credentials for that department 
  */  
  useEffect(() => {
    if(!selectedDepartment) {
      setCredentialList(null);
    }

    if (selectedDepartment && !error) getCredentialList(selectedDepartment);
  }, [selectedDepartment]);  
  
  /**
   * Get list of divisions to populate dropdowns
   * Fetch all from /divisions endpoint for administrators
   * Fetch assigned departments from /profile endpoint for employees and managers
   * @async
   * @function getDivisions
   */
  const getDivisions = async () => {
    setLoading(true);

    //get all the divisions for the administrator
    if (hasPermissionLevel(3)) {
      try {
        let data = await fetchData("/divisions", {
          method: "GET",
          isProtected: true,
        });

        if (data.error) {
          setError(data);
          throw new Error(data.message); //stop right here
        }

        // all good
        setDivisions([...data.divisions]);

      } catch (error) {

        console.log(error);

      }
    } else {
      //get all the divisions for the managers and employees
      try {
        let data = await fetchData("/profile", {
          method: "GET",
          isProtected: true,
        });

        if (data.error) {
          setError(data);
          throw new Error(data.message); //stop right here
        }

        // user has not been assigned departments yet!
        if (!data.departments.length) {
          setError({ code: 404, message: "No assigned departments" });
          throw Error("No assigned departments");
        }
        
        // all good
        setDivisions([...data.departments]);

      } catch (error) {

        console.log(error);

      }
    }
    setLoading(false);
  };

  /**
   * Get list of credentials list for selected department
   * from /credentials/:department_id endpoint 
   * @async
   * @function getCredentialList
   * 
   */
  const getCredentialList = async () => {

    setLoading(true);
    
    try{
      let data = await fetchData("/credentials/" + selectedDepartment, {
        method: "GET",
        isProtected: true,
      });

      if (data.error) {
        setError(data); 
        throw new Error(data.message); //stop right here
      }

      //all good
      setCredentialList([...data.credentials]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.message);

    }

  };

/**
 * Handles divisions select box change event
 * @function handleDivisionSelect
 * @param {Event} e
*/    
  const handleDivisionSelect = (e) => {
    setError(null);
    if (e.target.value === "") {
      // user selected "-- select operating unit --" option
      // reset all defaults 
      setSelectedDivision(undefined);
      setSelectedDepartment(undefined);
      setDepartments(null);

      //update url
      navigate(`/credentials/`);
    } else {
      // user selected an actual operating unit
      // set the division 
      setSelectedDivision(e.target.value);

      // update url
      navigate(`/credentials/${e.target.value}`);
    }
  };


/**
 * Handles department select box change event
 * @function handleDepartmentSelect
 * @param {Event} e
*/ 
  const handleDepartmentSelect = (e) => {
    setError(null);
    if (e.target.value === "") {
      // user selected "-- select department --" option
      // reset all defaults 
      setSelectedDepartment(undefined); 
      setCredentialList(null);

      //update url
      navigate(`/credentials/${selectedDivision}`);
    } else {
      //all good
      //set the department
      setSelectedDepartment(e.target.value);

      //update url
      navigate(`/credentials/${selectedDivision}/${e.target.value}`);
    }
  };

/**
 * Saves a new credential to database.
 * Call will come from child CredentialNew component 
 * @async 
 * @function postCredential
 * @param credential
*/     
  const postCredential = async (credential) => {

    try{
      let data = await fetchData("/credential/", {
        method: "POST",
        isProtected: true,
        body: credential,
      });

      if (data.error) throw Error(data.message); //stop right here

      //all good - update credentialList state with refreshed list
      setCredentialList([...data.credentials]);

      //notify user of success
      addToast({
        title: "Success",
        variant: "success",
        message: "Credential added!"
      });

    } catch (error) {

      console.log(error.messsage);

    }
    
  };

/**
 * Saves an edited credential to database.
 * Call will come from child Credential component  
 * @async 
 * @function putCredential
 * @param credential
*/   
  const putCredential = async (credential) => {

    try{

      let data = await fetchData("/credential/" + credential._id, {
        method: "PUT",
        isProtected: true,
        body: credential,
      });

      if (data.error) throw Error(data.message); //stop right here
      
      //all good - update credentialList state with refreshed list
      setCredentialList([...data.credentials]);

      //notify user of success
      addToast({
        title: "Success",
        variant: "success",
        message: "Credential updated!",
      });

    } catch (error){

      console.log(error.message);

    }

  };

/**
 * Delete a credential 
 * Call will come from child Credential component  
 * @async 
 * @function deleteCredential
 * @param credentialId
*/ 
  const deleteCredential = async (credentialId) => {

    try{
      let data = await fetchData("/credential/" + credentialId, {
        method: "DELETE",
        isProtected: true,
        body: { department: selectedDepartment}
      });

      if (data.error) throw Error(data.message); //stop right here

      //all good - update credentialList state with refreshed list
      setCredentialList([...data.credentials]);

      //notify user of success
      addToast({
        title: "Success",
        variant: "success",
        message: "Credential removed!",
      });      

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <>
      <h1>Credentials</h1>

      {divisions && (
        <Form>
          <Form.Select
            size="lg"
            className="mb-3"
            aria-label="Select operating unit"
            value={selectedDivision}
            onChange={(e) => handleDivisionSelect(e)}
          >
            <option value="">-- Select operating unit --</option>
            {divisions.map((division, idx) => {
              return (
                <option key={`div-${idx}`} value={division._id}>
                  {division.unit}
                </option>
              );
            })}
          </Form.Select>
          {departments && (
            <Form.Select
              size="lg"
              className="mb-3"
              aria-label="-- Select department -- "
              value={selectedDepartment}
              onChange={(e) => handleDepartmentSelect(e)}
            >
              <option value="">-- Select department --</option>
              {departments.map((department, idx) => {
                return (
                  <option key={`dep-${idx}`} value={department._id}>
                    {department.name}
                  </option>
                );
              })}
            </Form.Select>
          )}
        </Form>
      )}
      {!!error && <LoadWait loading={loading} error={error} />}
      {credentialList && (
        <Container className="mt-5">
          <h3>Available credentials</h3>
          <hr />
          {!credentialList.length && (
            <p>No credentials exist yet for this department.</p>
          )}
          <Row>
            {hasPermissionLevel(2) && (
              <Col md="4" sm="6" className="pb-4">
                <CredentialNew
                  key="credential-new"
                  saveCredential={postCredential}
                  department={selectedDepartment}
                />
              </Col>
            )}
            {credentialList.map((credential, idx) => {
              return (                
                  <Credential key={`credential-${idx}`}
                    existingCredential={credential}
                    saveCredential={putCredential}
                    deleteCredential={deleteCredential}
                  />              
              );
            })}
          </Row>
        </Container>
      )}
    </>
  );
};

export default CredentialsList;
