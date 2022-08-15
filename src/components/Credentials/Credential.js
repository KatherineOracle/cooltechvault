import { useEffect, useState } from "react";
import { Form, Col, Row, Button, Card } from "react-bootstrap";
import useAPIFetch from "../../hooks/useAPIFetch";
import useAuth from "../../hooks/useAuth";
import RenderModal from "../Modals/RenderModal";
import "./Credential.css";

/**
 * A single credential
 * @returns {React.ReactElement}
*/
const Credential = ({ existingCredential, saveCredential, deleteCredential }) => {
  const { hasPermissionLevel } = useAuth();
  const fetchData = useAPIFetch();
  const [showConfirmModal, setConfirmShowModal] = useState(false);  
  const [confirmDelete, setConfirmDelete] = useState(false);  
  const [password, setPassword] = useState("");
  const [editingMode, setEditingMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credential, setCredential] = useState({});

/**
 * We need to listen for the new credential otherwise 
 * it won't  update of you set it directly above
*/
  useEffect(() => {

    setCredential({...existingCredential});
  
  }, [existingCredential]);

/**
 * Manage state changes on confirmDelete 
 * 
 * The "Delete me" button triggers a modal. If modal changes
 * the state of confirmDelete to true, call deleteCredential method
 * (passed as props from parent CredentialList)
*/  
  useEffect(() => {
    
    if(confirmDelete) deleteCredential(credential._id);

  }, [confirmDelete, credential._id])
    
/**
 * Handles password show/hide button click
 * @function handleTogglePassword
 * @param {Event} e
*/  
  const handleTogglePassword = (e) => {
    e.preventDefault();
    if (!password || password === "") {
      getPassword();
    }
    setShowPassword(!showPassword);
  };

/**
 * Fetches the password for a single credential. Note passwords are 
 * not sent with the credentials list for a department (thinking security)
 * @async 
 * @function getPassword
*/   
  const getPassword = async () => {
    
    try{
      let data = await fetchData("/credential/password/" + credential._id, {
        method: "GET",
        isProtected: true,
      });

      if (data.error) throw Error(data.message);
      setPassword(data.password);

    } catch (error) {

      console.log(error);

    }

  }  

/**
 * Handles toggle editing button (administrators only)
 * if editingMode is true, text elements show as form fields
 * @function toggleEditingMode
 * @params {Event} e
*/ 
  const toggleEditingMode = (e) => {
    e.preventDefault();
    setEditingMode(!editingMode);
  };

/**
 * Handles Form Submit (to save edited credential)
 * @function handleSubmit
 * @params {Event} e
*/   
  const handleSubmit = (e) => {
    e.preventDefault();
    saveCredential({...credential, ...{password: password}});
    setEditingMode(!editingMode);
  };

  return (
    <>
    <Col  md="4" sm="6" className="pb-4">
    <Card className="mb-3 credential">
      <Form onSubmit={handleSubmit}>
        <h4 className="mb-3">
          {editingMode && (
            <Form.Group className="mb-3" controlId="platformControl">
              <Form.Control
                type="text"
                placeholder="Edit platform title"
                value={credential.platform}
                onChange={(e) =>
                  setCredential({ ...credential, platform: e.target.value })
                }
                required
              />
            </Form.Group>
          )}
          {!editingMode && credential.platform}
        </h4>
        <Form.Group className="mb-3" controlId="urlControl">
          {editingMode && (
            <Form.Control
              type="text"
              placeholder="Edit URL"
              value={credential.url}
              onChange={(e) =>
                setCredential({ ...credential, url: e.target.value })
              }
              required
            />
          )}
          {!editingMode && (
            <p>
              <Form.Label>URL:</Form.Label>{" "}
              <a href={credential.url}>{credential.url}</a>
            </p>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="usernameControl">
          {editingMode && (
            <Form.Control
              type="text"
              placeholder="Edit username"
              value={credential.username}
              onChange={(e) =>
                setCredential({ ...credential, username: e.target.value })
              }
              required
            />
          )}
          {!editingMode && (
            <p>
              <Form.Label>Username:</Form.Label> {credential.username}
            </p>
          )}
        </Form.Group>

        {editingMode && (
          <Form.Group className="mb-3">
            <Button
              className="btn-toggle-passwordshow"
              onClick={(e) => handleTogglePassword(e)}
            >
              <i className={showPassword ? "icon-eye-off" : "icon-eye"}></i>
            </Button>
            {showPassword && (
              <Form.Control
                type="text"
                className="password-control"
                value={password}
                placeholder="Edit password"
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            )}
            {!showPassword && (
              <Form.Control
                type="password"
                className="password-control"
                value={password}
                placeholder="Edit password"
                onChange={(e) =>
                    setPassword(e.target.value)
                }
                required
              />
            )}
          </Form.Group>
        )}
        {!editingMode && (
          <Row className="mb-3">
            <Col md={12}>Password:</Col>
            <Col md={12} className="d-flex align-items-center">
              {showPassword && (
                <span className="password-showhide">{password}</span>
              )}
              {!showPassword && (
                <span className="password-showhide">
                  &#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;
                </span>
              )}{" "}
              <Button onClick={(e) => handleTogglePassword(e)}>
                <i className={showPassword ? "icon-eye-off" : "icon-eye"}></i>
              </Button>
            </Col>
          </Row>
        )}        
        {/* Permission level 3 = administrator */
          hasPermissionLevel(3) && (
          <Row className="justify-content-space-between align-items-center actions">
            <Col md="auto">
            {editingMode && <><Button variant="primary" type="submit">
                Save credential
              </Button> &nbsp; <Button variant="danger" onClick={(e) => setConfirmShowModal(true)}>Delete me
            </Button></>
            }
            {!editingMode && <Button variant="light" onClick={toggleEditingMode}>
                Start editing credential
              </Button>
            }
            </Col>
          </Row>
        )}
      </Form>
    </Card>
    </Col>
    {//Delete button clicked! 
      (showConfirmModal) &&
      <RenderModal objType="credential" setProceedState={setConfirmDelete}/>
    }
    </>
  );
};

export default Credential;
