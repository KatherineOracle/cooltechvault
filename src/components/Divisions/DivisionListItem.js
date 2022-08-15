import { useState, useEffect } from "react";
import { Col, Button } from "react-bootstrap";
import RenderModal from "../Modals/RenderModal";

/**
 * Displays single department belonging to a division/operating unit
 * @returns {React.ReactElement}
 */
const DivisionListItem = ({
  provided,
  snapshot,
  handleDivisionEdit,
  handleDivisionDelete,
  parent,
  item,
}) => {
  
  const [editable, setEditable] = useState(false);
  const [showConfirmModal, setConfirmShowModal] = useState(false); 
  const [department, setDepartment] = useState({...item});
  const [confirmDelete, setConfirmDelete] = useState(false); 


/**
 * Manage state changes on confirmDelete 
 * 
 * The "Delete" button triggers a modal. If modal changes
 * the state of confirmDelete to true, call handleDivisionDelete method
 * (passed as props from parent DivisionList)
*/  
useEffect(() => {
    
  if(confirmDelete) handleDivisionDelete(parent, item._id);

}, [confirmDelete])
    

/**
 * Handle toggle button click
 *   
 * @function handleToggleEditable
 * @param {Event} e
*/     
  const handleToggleEditable= (e) => {
    e.preventDefault();
    //if department is currently editable mode, then save
    if(editable){
      handleDivisionEdit(parent, department)
    }
    //switch modes
    setEditable(!editable);
  }

/**
 * Handle user cursor moves out of editable field
 * 
 * @function handleEditableBlur
*/   
const handleEditableBlur  = () => {
  //save changes 
  handleDivisionEdit(parent, department);

  //switch mode back to text
  setEditable(!editable);
}  

  return (
    <>
      <div
        className="division-list-item align-items-center g-0 d-flex"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86",
          ...provided.draggableProps.style,
        }}
      >
        <Col className="flex-grow-1">
          <div className="editable">
            {editable && (
              <textarea
                onBlur={(e) => handleEditableBlur(e)}
                onChange={(e) => setDepartment({...department, ...{name: e.target.value}})}
                value={department.name}
                rows="1"
                cols="15"
                className="likeText"                
              />
            )}
            {!editable && <span className="likeText">{item.name}</span>}
            <Button className="btn btn-edit" onClick={(e) => handleToggleEditable(e)}>
              <i className="icon-edit"></i>
            </Button>
          </div>
        </Col>
        <Col className="flex-grow-0">
          <Button className="btn btn-delete btn-danger round" onClick={() => setConfirmShowModal(true)}>
            &times;
          </Button>
        </Col>
      </div>
    {//Delete button clicked! 
      (showConfirmModal) &&
      <RenderModal objType="department" setProceedState={setConfirmDelete}/>
    }
    </>
  );
};

export default DivisionListItem;
