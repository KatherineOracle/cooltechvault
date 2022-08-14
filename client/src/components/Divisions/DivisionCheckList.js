import { Row, Col, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import useAPIFetch from "../../hooks/useAPIFetch";
import LoadWait from "../Errors/LoadWait";
import "./DivisionList.css";

/**
 * Displays check box lists of departments for each operating unit
 * Used by the User/User Component to assign departments to user
 * See route /users/user/:id
 * @returns {React.ReactElement}
 */
const DivisionCheckList = ({ userDepartments, setUserDepartments }) => {
  const fetchData = useAPIFetch();
  const [divisions, setDivisions] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  /**
   * On inital component load
   */
  useEffect(() => {
    if (!divisions) getDivisions();
  }, []);

  /**
   * Get list of all divisions from /divisions endpoint for administrators
   * @async
   * @function getDivisions
   */
  const getDivisions = async () => {
    setLoading(true);
    try {
      let data = await fetchData("/divisions", {
        method: "GET",
        isProtected: true,
      });

      if (data.error) {
        setError(data.error);
        throw Error(data.message); //stop right here
      }

      //all good update Divisions state
      setDivisions([...data.divisions]);


    } catch (error) {
      console.log(error);
    }
    setLoading(false);

  };

/**
 * Handles checkbox check/uncheck
 * @function handleChange
 * @param {Event} e
*/    
  const handleChange = (e) => {
    //is it checked?
    //yes = add to departmentlist
    if(e.target.checked) {
      const newDepartments = [...userDepartments];
      newDepartments.push(e.target.value);
      setUserDepartments([...newDepartments]);
    }
    
    //no remove from department list
    if (!e.target.checked) {
      const newDepartments = [...userDepartments];
      const ind = newDepartments.indexOf(e.target.value);
      newDepartments.splice(ind, 1);
      setUserDepartments([...newDepartments]);
    }
  };

  if (!divisions) return <LoadWait loading={loading} error={error} />;

  return (
    <Row>
      {divisions.map((division, idx) => {
        return (
          <Col key={`div-${idx}`} md="3">
            <h4>{division.unit}</h4>
            <ul className="ps-0" type="none">
              {division.departments.map((item, idy) => {
                return (
                  <li key={`dep-${idy}`}>
                    <Form.Label>
                      <Form.Check
                        type="checkbox"
                        checked={userDepartments.indexOf(item._id) > -1}
                        label={item.name}
                        value={item._id}
                        id={`department-${item._id}`}
                        onChange={handleChange}
                      />
                    </Form.Label>
                  </li>
                );
              })}
            </ul>
          </Col>
        );
      })}
    </Row>
  );
};

export default DivisionCheckList;
