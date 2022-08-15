import { useState, useEffect } from "react";
import useAPIFetch from "../../hooks/useAPIFetch";
import useToasts from "../../hooks/useToasts"
import { Form, Col, Row, Button } from "react-bootstrap";
import LoadWait from "../Errors/LoadWait";
import DepartmentList from "./DepartmentList";

/**
 * A basic view of the logged in user for the logged in user
 * Name, Password, email are editable
 * @returns {React.ReactElement}
*/
const ProfileForm = () => {
  const fetchData = useAPIFetch();
  const {addToast} = useToasts();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);  
  const [profile, setProfile] = useState(null);
  const [password, setPassword] = useState(null);
  const [departments, setDepartments] = useState(null);

  /**
   * On inital component load
  */  
  useEffect(() => {
    if (!profile) getProfile();
  }, []);

/**
 * Fetches the user profile.
 * @async
*/  
  const getProfile = async () => {
    
    //try refresh
    setLoading(true);

    try {
      let data = await fetchData("/profile", {
        method: "GET",
        isProtected: true,
      })
      if(data.error) {
        setError(data);
        throw new Error(data.message);
      }
      setProfile({ ...data.user });
      if(data.departments) setDepartments([...data.departments]);

    } catch (error){
      console.log(error.message); 

    }
      setLoading(false);
  };

/**
 * Updates the user profile via API fetch.
 * @async
 * @param {object} newProfile
*/  
  const putProfile = async (newProfile) => {

    setLoading(true);
    try {
      let data = await fetchData("/profile", {
        method: "PUT",
        isProtected: true,
        body: newProfile
      });

      if(data.error) {
        throw new Error(data.message);
      }

      setProfile({ ...data.user });

      addToast({title: "Success!", 
            variant: 'Success', 
            message: data.message}
            );

    } catch(error) {        
        console.log(error.message)
    };  
    setLoading(false);
  }

/**
 * Handles update form submit
 *
 * @param {event} e
*/    
  const submitHandler = (e) => {
    e.preventDefault();

    let newProfile = {...profile};

    /**    
    * The hashed password is not sent via the profile endpoint.
    * If the user has typed in a new password 
    * we need to merge it with the rest of the profile
    * details before saving to the database.  
    */  
    if(password && password !== ""){
      newProfile = {...profile, password: password}
    }
    putProfile(newProfile);
    
  };


  return (
    <>
      <section className="row col col-lg-8 col-xl-7">
        <h1>Your profile</h1>
        {(!profile) && <LoadWait loading={loading} error={error} />}

        <Form onSubmit={submitHandler}>
          {(profile) && (
            <>
              <Form.Group
                className="row mb-3 align-items-center" controlId="formBasicEmail">
                <Form.Label className="col col-md-4">Your name</Form.Label>
                <Col md="8">
                  <Form.Control
                    type="text"
                    value={profile.realName}
                    required
                    onChange={(e) =>
                      setProfile({ ...profile, realName: e.target.value })
                    }
                  />
                </Col>
              </Form.Group>
              <Form.Group
                className="row mb-3 align-items-center" controlId="formBasicPassword">
                <Form.Label className="col col-md-4">Your password</Form.Label>
                <Col md="8">
                <Form.Control type="password"  minLength="8" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"  onChange={e => setPassword(e.target.value)} />
                </Col>
              </Form.Group>
              <Form.Group
                className="row mb-3 align-items-center" controlId="formBasicEmail">
                <Form.Label className="col col-md-4">Your email</Form.Label>
                <Col md="8">
                  <Form.Control
                    type="email"
                    value={profile.email}
                    required
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </Col>
              </Form.Group>

              <Row className="mb-3 justify-content-space-between align-items-center">
                <Col md="4"><label>Role:</label></Col>
                <Col md="8">{profile.role}</Col>
              </Row>


              {(departments && !!departments.length) && <DepartmentList departments={departments}  />
              }

              <Row className="justify-content-space-between align-items-center actions">
                <Col md="auto">
                  <Button variant="primary" type="submit">
                    Update my profile
                  </Button>
                </Col>
              </Row>            
            </>
          )}

      </Form>
      </section>
    </>
  );
};

export default ProfileForm;
