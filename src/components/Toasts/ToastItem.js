import React from "react";
import { useState } from 'react';
import { Toast as Toasty } from 'react-bootstrap';
import useToasts from '../../hooks/useToasts';

/**
 * Displays a pop-up modal to confirm a delete action in a parent component.
 * 
 * @returns {React.ReactElement}
*/
const ToastItem = ({ toast }) => {

  const [show, setShow] = useState(true);
  const { deleteToast } = useToasts();

/**
 * Handle close toast
 * 
*/  
  const toggleShow = () => {
    //hide toast
    setShow(false);

    //delete toast
    deleteToast(toast.id);
  }

    return (
        <Toasty key={toast.id} bg={toast.variant.toLowerCase()} show={show} onClose={toggleShow}>
        <Toasty.Header>
          <span className="me-auto">{toast.title}</span>
        </Toasty.Header>
        <Toasty.Body>{toast.message}</Toasty.Body>
      </Toasty>
    )
};

export default ToastItem;