
import { useState } from "react";
import {Button, Modal} from "react-bootstrap";

/**
 * Displays a pop-up modal to confirm a delete action in a parent component.
 * 
 * @returns {React.ReactElement}
 */
  const RenderModal = ( {objType, setProceedState} ) => {

    const [showModal, setShowModal] = useState(true); 

/**
 * Handle modal close event
 *   
 * @function handleToggleEditable
 * @param {Boolean} confirmation
*/    
  const handleCloseModal = (confirmation) => {
      // set Parent component state to delete item
      if (confirmation) setProceedState(true);
      
      //close modal
      setShowModal(false);
    };      

    return (
      <Modal
        show={showModal}
        onHide={(e) => handleCloseModal(e, false)}
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you really want to delete this {objType}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={(e) => handleCloseModal(true)}>
            Proceed
          </Button>
          <Button variant="danger" onClick={(e) => handleCloseModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  export default RenderModal;
