import { Row, Col, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import useAPIFetch from "../../hooks/useAPIFetch";
import useToasts from "../../hooks/useToasts";
import LoadWait from "../Errors/LoadWait";
import DivisionListItem from "./DivisionListItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./DivisionList.css";

/**
 * Displays lists of departments for each operating unit in columns
 * departments can be added/edited rearranged and dragged between operating units
 * @see  Colby Fayock's quick Beautiful DnD tuturial (like I did) https://www.youtube.com/watch?v=aYZRRyukuIw
 * @returns {React.ReactElement}
 */
const DivisionList = () => {
  const fetchData = useAPIFetch();
  const { addToast } = useToasts();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [divisions, setDivisions] = useState(null);
  const [newDepartment, setNewDepartment] = useState(null);

  /**
   * On inital component load
  */
  useEffect(() => {
    if (!divisions) getDivisions();
  }, []);

/**
 * gets all the divisions.
 * @async 
 * @function postCredential
 * @param credential
*/    
  const getDivisions = async () => {
    
    setLoading(true);
    try{

      let data =  await fetchData("/divisions", {
        method: "GET",
        isProtected: true,
      });

      if (data.error) {
        setError(data);
        throw new Error(data.message);
      }
      setDivisions([...data.divisions]);      

    } catch (error) {

      console.log(error);
    
    }
    setLoading(false);

  };

/**
 * Saves all divisions to database.
 * Called for every change to the drag and dropzones
 * @async 
 * @function putDivisions
 * @param divisions
*/    
  const putDivisions = async (divisions) => {

    try{
      let data = await fetchData("/divisions/", {
        method: "PUT",
        isProtected: true,
        body: divisions,
      });

      if (data.error) throw Error(data.message); //stop right here

      //All good. Update state with returned data
      setDivisions([...data.divisions]);

      //notify user of success
      addToast({
        title: "Success",
        variant: "success",
        message: "Divisions updated!",
      });      

    } catch (error){

      console.log(error.message)

    }

  }  

/**
 * Handles drag and drop events
 * @function onDragEnd
 * @param {Event} e
*/    
  const onDragEnd = (result) => {
   
    const { source, destination } = result;

    //no change from drag drop 
    if (!destination || 
      (destination.droppableId === source.droppableId && destination.index === source.index)
      ) return;
    
    const copiedDivisions = [...divisions];  

    //find the division the department WAS in 
    const sourceColumnId = divisions.findIndex((div) => {
      return div._id === source.droppableId;
    });
    const sourceColumn = copiedDivisions[sourceColumnId];

    //find the division the department IS moving to 
    const destinationColumnId = divisions.findIndex((div) => {
      return div._id === destination.droppableId;
    });
    const destColumn = copiedDivisions[destinationColumnId];

    //remove the department from its previous division   
    const removed = sourceColumn.departments.splice(source.index, 1);
    
    //add the department to new division   
    destColumn.departments.splice(destination.index, 0, ...removed);

    //save to database
    putDivisions(copiedDivisions);
  };

/**
 * Handles new department form submit
 * @function handleNewDepartmentSubmit
 * @param {Event}   e
 * @param {String}  divisionId
*/     
  const handleNewDepartmentSubmit = (e, divisionId) => {
    e.preventDefault();
    const copiedDivisions = [...divisions];

    //find division to edit
    const divisionIndex = divisions.findIndex((div) => {
      return div._id === divisionId;
    });

    //add new department to end of list for corret division
    copiedDivisions[divisionIndex].departments.push({ name: newDepartment });

    //update to database
    putDivisions(copiedDivisions);

    //reset the form
    Array.from(e.target).forEach((e) => (e.value = ""));
  };

/**
 * Handles department delete
 * @function handleNewDepartmentSubmit
 * @param {String}  divisionId
 * @param {String}  depId 
*/  
  const handleDivisionDelete = async (divisionId, depId) => {
    const copiedDivisions = [...divisions];

    //find division to edit
    const divisionIndex = divisions.findIndex((div) => {
      return div._id === divisionId;
    });

    //department index to remove
    const departmentIndex = copiedDivisions[
      divisionIndex
    ].departments.findIndex((dep) => {
      return dep._id === depId;
    });

    //remove department
    copiedDivisions[divisionIndex].departments.splice(departmentIndex, 1);

    //update to database
    putDivisions(copiedDivisions);
  };

/**
 * Handles department edit
 * @function handleDivisionEdit
 * @param {String}  divisionId
 * @param {Object}  department  
*/  
  const handleDivisionEdit = async (divisionId, department) => {
    const copiedDivisions = [...divisions];

    //division to edit
    const divisionIndex = divisions.findIndex((div) => {
      return div._id === divisionId;
    });

    //department index to replace
    const departmentIndex = copiedDivisions[
      divisionIndex
    ].departments.findIndex((dep) => {
      return dep._id === department._id;
    });

    //replace  department at found index with new department 
    copiedDivisions[divisionIndex].departments[departmentIndex] = department;

    //update to database
    putDivisions(copiedDivisions);
  };

  if (!divisions) return <LoadWait loading={loading} error={error} />;

  return (
    <>
      <h1>Divisions</h1>

      <Row className="g-1">
        <DragDropContext
          onDragEnd={(dropResult) => onDragEnd(dropResult)}
        >
          {divisions.map((division, idx) => {
            return (
              <Col className="d-flex flex-column align-items-center"
                key={division._id}
              >
                <h3>{division.unit}</h3>
                <div>
                  <Droppable droppableId={division._id} key={division._id}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="drop-column"
                          style={{
                            background: snapshot.isDraggingOver? "lightblue": "lightgrey"
                          }}
                        >
                          {/*Each column has an add department form */}  
                          <Form
                            onSubmit={(e) => handleNewDepartmentSubmit(e, division._id)}
                            className="row g-1 mb-2">
                            <Col md={"auto"}>
                              <Form.Control
                                type="text"
                                placeholder="New department"
                                onChange={(e) => setNewDepartment(e.target.value)}
                              />
                            </Col>
                            <Col md={"auto"}>
                              <Button type="submit">+</Button>
                            </Col>
                          </Form>
                          
                          {division.departments.map((item, idx) => {
                            return (
                              <Draggable
                                key={item._id}
                                draggableId={item._id}
                                index={idx}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <DivisionListItem
                                      provided={provided}
                                      snapshot={snapshot}
                                      handleDivisionEdit={handleDivisionEdit}
                                      handleDivisionDelete={handleDivisionDelete}
                                      parent={division._id}
                                      item={item}
                                    />
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </Col>
            );
          })}
        </DragDropContext>
      </Row>
    </>
  );
};

export default DivisionList;
