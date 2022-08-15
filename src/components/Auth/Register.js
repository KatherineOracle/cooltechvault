import { Form , Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useToasts from '../../hooks/useToasts';
import useAPIFetch from '../../hooks/useAPIFetch';

/**
 * The registration form
 * @returns {React.ReactElement}
*/
const Register = () => {

  const {addToast} = useToasts();
  const [profile, setProfile] = useState(null);
  const fetchData = useAPIFetch();

/**
 * Handles form submit
 * @async 
 * @function submitHandler
 * @param {Event} e
*/
  const submitHandler = async (e) => {
      e.preventDefault();

    try{
      let data = await fetchData('/register', {isProtected: false, method: 'POST', body: profile});

      if(data.error) { // stop right there
        throw new Error(data.message);
      }

      // notify user of success
      addToast({title: "Welcome!", 
        variant: 'Success', 
        message: data.message}
      );

    } catch (error) {

      console.log(error.message);

    }
        
  }

  return (
    <>
      <section className="row col col-lg-8 col-xl-7">
        <h1>Register</h1>
        <Form onSubmit={submitHandler}>
        <Form.Group
          className="row mb-3 align-items-center" controlId="formName">
            <Form.Label className="col col-md-3">Your Name</Form.Label>
              <Col md="9">
                <Form.Control
                  type="text" required
                  onChange={(e) =>
                    setProfile({ ...profile, realName: e.target.value })
                  }
                />
              </Col>
          </Form.Group>        
        <Form.Group className="row mb-3 align-items-center" controlId="formEmail">
          <Form.Label className="col col-md-3">Your Email</Form.Label>
            <Col md="9">
              <Form.Control 
                type="email" required onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
                } 
                />
              </Col>            
        </Form.Group>
        <Form.Group className="row mb-3 align-items-center" controlId="formPassword">
            <Form.Label className="col col-md-3">Your Password</Form.Label>
            <Col md="9">
              <Form.Control 
                type="password"  minLength="8" required onChange={(e) =>
                setProfile({ ...profile, password: e.target.value })
                } 
                />
              </Col>
          </Form.Group>
          <Row className="justify-content-space-between align-items-center actions">
            <Col md="auto">
              <Button variant="primary" type="submit">
                Register</Button>
            </Col> 
            <Col md="auto"> 
              <Link to="/login">
              Login with existing account
              </Link> 
            </Col>              
          </Row>                  
        </Form>
      </section>
    </>          
  );
};

export default Register;
