import { Col, Row } from "react-bootstrap";

/**
 * A list of assigned departments for the user profile (not editable)
 * @returns {React.ReactElement}
 * 
*/
const DepartmentList = ( { departments } ) => {

    return <Row className="mb-3 justify-content-space-between align-items-top">
    <Col md="4"><label>Assigned departments:</label></Col>
    <Col md="8">
    <ul className="row d-flex g-3 ps-0 " type="none">
      {
        departments.map((div,idx) => (
        <li className="col col-md-6" key={`div-${idx}`}><h6>{div.unit}</h6>
        
        {div.departments.map((dep,idk) => (
          <span key={`dep-${idk}`}>&#187; {dep.name}<br/></span> 
        ))}
        </li>
      ))
      }
     </ul>                
    </Col>
    </Row>

}

export default DepartmentList;
