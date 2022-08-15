import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useToasts from "../../hooks/useToasts";
import { useNavigate, useParams } from "react-router-dom";
import useAPIFetch from "../../hooks/useAPIFetch";
import { Button, Form, Row, Col } from "react-bootstrap";
import DivisionCheckList from "../Divisions/DivisionCheckList";
import RenderModal from "../Modals/RenderModal";
import LoadWait from "../Errors/LoadWait";

/**
 * Displays a single user form - only administrators have access to this
 *
 * @returns {React.ReactElement}
 */
const User = () => {

  const { user, authMap } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [showConfirmModal, setConfirmShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const params = useParams();
  const id = params.id;
  const fetchData = useAPIFetch();
  const [userData, setUserData] = useState(null);
  const [userDepartments, setUserDepartments] = useState([]);

  /**
   * On inital component load
   */
  useEffect(() => {    
    
    if(id === "new") {

      setUserData({
        _id: "new",
        realName: "",
        email: "",
        username: "",
        role: "",
        departments: [],
     });

    setUserDepartments([]);
    return;
    }
   
    if (!userData) getUser();

  }, []);

  /**
   * Manage state changes on confirmDelete
   *
   * The "Delete" button triggers a modal. If modal changes
   * the state of confirmDelete to true, call userDelete method
   */
  useEffect(() => {
    if (confirmDelete) userDelete();
  }, [confirmDelete]);

  /**
   * Fetches  user from the /user endpoint.
   * @function getUser
   * @async
   */
  const getUser = async () => {
    setLoading(true);
    try {
      let data = await fetchData("/user/" + id, {
        method: "GET",
        isProtected: true,
      });

      if (data.error) {
        setError(data.error);
        throw Error(data.message); //stop right here
      }

      //all ok. Update user state
      setUserData({ ...data.user });

      //Update user departments
      setUserDepartments([...data.user.departments]);
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  };

  /**
   * Handles form submit.
   * @param {Event} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    //merge departments
    const newUserData = {
      ...userData,
      departments: [...new Set(userDepartments)], //use set to make sure no duplicates
    };

    //post if new
    if(id === "new"){
      delete newUserData._id;
      postUser(newUserData);
      return;
    } 
    //put if exiting
    putUser(newUserData);
  };

  /**
   * Updates and fetches refreshed user from the /user endpoint.
   * @async
   * @param {Object} newUserData
   */
  const putUser = async (newUserData) => {
    try {
      let data = await fetchData("/user/" + id, {
        method: "PUT",
        isProtected: true,
        body: newUserData,
      });

      if (data.error) throw Error(data.message); //stop right here

      //all ok. Update user state
      setUserData({ ...data.user });

      //Update user departments
      setUserDepartments([...data.user.departments]);

      //notify user of success
      addToast({ title: "Success", variant: "success", message: data.message });
    } catch (error) {
      console.log(error);
    }
  };


  /**
   * Posts new user to the /user endpoint.
   * @async
   * @param {Object} newUserData
   */
   const postUser = async (newUserData) => {
    try {
      let data = await fetchData("/user", {
        method: "POST",
        isProtected: true,
        body: newUserData,
      });

      if (data.error) throw Error(data.message); //stop right here

      //all ok. Update user state
      setUserData({ ...data.user });

      //Update user departments
      setUserDepartments([...data.user.departments]);

      //notify user of success
      addToast({ title: "Success", variant: "success", message: data.message });
      
    } catch (error) {
      console.log(error);
    }
  };  

  /**
   * Deletes user from user/:id endpoint and navigate back to user list.
   * @async
   */
  const userDelete = async () => {
    
    try{
    
    let data = await fetchData("/user/" + id, {
      method: "DELETE",
      isProtected: true,
    });

    if (data.error) throw Error(data.message); //stop right here

    addToast({
      title: "Success",
      variant: "success",
      message: data.message,
    });    

    navigate("/users", { replace: true });

    } catch (error) {

      console.log(error.message);

    }

  };

  if (!userData) return <LoadWait loading={loading} error={error} />;

  return (
    <>
      <Row className="justify-content-start">
        <Col xs={12} md={12} lg={10} xl={9}>
          <h1 className="pb-3">User information:</h1>
          <Form onSubmit={handleSubmit}>
            <Row className="d-flex mb-3 align-items-center">
              <Col className="col-md-3 col-lg-2" aria-hidden="true">
                <Form.Label>Real name:</Form.Label>
              </Col>
              <Col md={9} lg={10}>
                <Form.Control
                  type="text"
                  value={userData.realName}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      ...{ realName: e.target.value },
                    })
                  }
                />{" "}
              </Col>
            </Row>
            <Row className="d-flex mb-3 align-items-center">
              <Col className="col-md-3 col-lg-2" aria-hidden="true">
                <Form.Label>Role:</Form.Label>
              </Col>
              <Col md={9} lg={10}>
                <Form.Select
                  aria-label="Select system role"
                  value={userData.role}
                  onChange={(e) =>
                    setUserData({ ...userData, ...{ role: e.target.value } })
                  }
                >
                  <option>-- select system role --</option>
                  {Object.keys(authMap).map((key, idx) => {
                    return (
                      <option key={`role-${idx}`} value={key}>
                        {key}
                      </option>
                    );
                  })}
                </Form.Select>
              </Col>
            </Row>
            <Row className="d-flex mb-3 align-items-center">
              <Col className="col-md-3 col-lg-2">
                <Form.Label>Email address:</Form.Label>
              </Col>
              <Col md={9} lg={10}>
                <Form.Control
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, ...{ email: e.target.value } })
                  }
                />{" "}
              </Col>
            </Row>
            <Row className="d-flex mb-3 align-items-center">
              <Col className="col-md-3 col-lg-2">
                <Form.Label>Password:</Form.Label>
              </Col>
              <Col md={9} lg={10}>
                <Form.Control
                  type="password"
                  minLength="8"
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;"
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      ...{ password: e.target.value },
                    })
                  }
                />{" "}
              </Col>
            </Row>
            <Row className="d-flex mb-3 align-items-start">
              <Col className="col-md-3 col-lg-2">
                <Form.Label>Operating units:</Form.Label>
              </Col>
              <Col md={9} lg={10}>
                <DivisionCheckList
                  userDepartments={userDepartments}
                  setUserDepartments={setUserDepartments}
                />
                <hr />
              </Col>
            </Row>
            <div className="d-flex justify-content-center align-items-center actions">
              {(id === "new") &&
                <Button variant="primary" type="submit">
                  Save user
                </Button>
              }

              { (id !== "new") &&
                <>
                  <Button variant="primary" type="submit">
                    Update user
                  </Button>
                  {user.id !== userData._id && (
                    <Button
                      variant="danger"
                      onClick={(e) => setConfirmShowModal(true)}
                    >
                      Delete me
                    </Button>
                  )}
                </>
              }
            </div>
          </Form>
        </Col>
      </Row>
      {
        //Delete button clicked!
        showConfirmModal && (
          <RenderModal objType="user" setProceedState={setConfirmDelete} />
        )
      }
    </>
  );
};

export default User;
