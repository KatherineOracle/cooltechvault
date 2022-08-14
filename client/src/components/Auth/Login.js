import { useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import useAuth  from '../../hooks/useAuth';  

/**
 * The login form
 * @returns {React.ReactElement}
*/
const Login = () => {
  const {login} = useAuth();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const location = useLocation();
  console.log(location.state);
/**
 * Handles form submit
 * @function submitHandler
 * @param {Event} e
*/  
  const submitHandler = (event) => {
    event.preventDefault();
    
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    
    const body = {
      email: enteredEmail, 
      password: enteredPassword
    }

    const from = location.state?.from?.pathname || "/";

    login(body, false, from);

  }

  return (
    <>
    <section className="row col col-lg-8 col-xl-7">
      <h1>Login</h1>
      <Form onSubmit={submitHandler}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label >Your Email</Form.Label>
      <Form.Control type="email" required ref={emailInputRef} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label >Your Password</Form.Label>
          <Form.Control type="password"  minLength="8" required ref={passwordInputRef} />
        </Form.Group>
        <Row className="justify-content-space-between align-items-center actions">
          <Col md="auto">
            <Button variant="primary" type="submit">Login</Button>
          </Col> 
          <Col md="auto"> 
            <Link to="/register">Create new Account</Link>
          </Col>              
        </Row>
      </Form>
    </section>
    </>          
  );
};

export default Login;
