import { useEffect, useState } from "react";
import { Form, Col, Row, Button, Card } from "react-bootstrap";
import "./Credential.css";

/**
 * A form to add a new credential
 * @returns {React.ReactElement}
 */
const CredentialNew = ({ saveCredential, department }) => {
  const initialCredential = {
    platform: "",
    url: "",
    username: "",
    password: "",
    department: department,
  };
  const [credential, setCredential] = useState({ ...initialCredential });
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Listen for state changes on department prop
   *
   * If the user selected a different department from the parent
   * component's dropdown we must update the credential state
   * here, otherwise we might save to the wrong department!
  */
  useEffect(() => {
    setCredential({ ...credential, department: department });
  }, [department]);

  /**
   * Handles password visibility toggle
   * @function handleTogglePassword
   * @param {Event} e
  */
  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  /**
   * Handles form submit
   * Calls saveCredential method, passed as props from parent CredentialList.
   * Resets the credential state to default, ready for next new entry.
   * @function handleSubmit
   * @param {Event} e
  */
  const handleSubmit = (e) => {
    e.preventDefault();
    saveCredential({ ...credential });
    setCredential({ ...initialCredential });
  };

  return (
    <Card className="new mb-3 credential">
      <Form onSubmit={handleSubmit}>
        <h4 className="mb-3">
          <Form.Group controlId="platformControl">
            <Form.Control
              type="text"
              placeholder="Add platform title"
              value={credential.platform}
              onChange={(e) =>
                setCredential({ ...credential, platform: e.target.value })
              }
              required
            />
          </Form.Group>
        </h4>

        <Form.Group className="mb-3" controlId="urlControl">
          <Form.Control
            type="text"
            placeholder="Add URL"
            value={credential.url}
            onChange={(e) =>
              setCredential({ ...credential, url: e.target.value })
            }
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="usernameControl">
          <Form.Control
            type="text"
            placeholder="Add username"
            value={credential.username}
            onChange={(e) =>
              setCredential({ ...credential, username: e.target.value })
            }
            required
          />
        </Form.Group>

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
              value={credential.password}
              placeholder="Add password"
              onChange={(e) =>
                setCredential({ ...credential, password: e.target.value })
              }
              required
            />
          )}
          {!showPassword && (
            <Form.Control
              type="password"
              className="password-control"
              value={credential.password}
              placeholder="Add password"
              onChange={(e) =>
                setCredential({ ...credential, password: e.target.value })
              }
              required
            />
          )}
        </Form.Group>
        <Row className="justify-content-space-between align-items-center actions">
          <Col md="auto">
            <Button variant="primary" type="submit">
              Save new credential
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default CredentialNew;
