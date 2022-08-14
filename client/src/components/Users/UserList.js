import { useState, useEffect } from "react";
import { Table, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserListItem from "./UserListItem";
import useAuth from "../../hooks/useAuth";
import useAPIFetch from "../../hooks/useAPIFetch";
import useToasts from "../../hooks/useToasts";
import LoadWait from "../Errors/LoadWait";

/**
 * Displays a list of all users - only administrators have access to this 
 * users can be filtered by role
 * 
 * @returns {React.ReactElement}
 */
const UserList = () => {
  const fetchData = useAPIFetch();
  const { authMap } = useAuth();
  const { addToast } = useToasts();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);        
  const [userList, setUserList] = useState(null);
  const [filters, setFilters] = useState({role: undefined});
   
  /**
   * On inital component load
  */    
  useEffect(() => {

    if(!userList) getUserList({});
  
  }, []);    

  /**
   * Listen for change to filters state change 
  */       
  useEffect(() => {

    getUserList({...filters});

  }, [filters]);  

  /**
   * Fetches list of users from the /users endpoint.
   * @function getUserList
   * @async
   */ 
  const getUserList = async (params = {}) => {

      setLoading(true);

      try{

        let data = await fetchData('/users', {
          method: 'POST',
          isProtected: true, 
          body: {...params}    
        });

        if(data.error) {
          setError(data.error)
          throw Error(data.message); //stop right here
        }

        //all ok, update userList state 
        setUserList([...data.users]);


      } catch (error) {

        console.log(error);

      }

      setLoading(false);
  }


    if(!userList) return <LoadWait loading={loading} error={error} />

    return(
        <>
        <div>
          <Link className="btn btn-primary float-right" to={'user/new'}>Add new User</Link>
          <h1>Users</h1>  
        </div>
        <Form className="bg-light p-3">
          <div className="d-flex p-1 align-items-center">
            <div className="flex-shrink-1 pe-4"><label>Filter by</label></div>
            <div className="flex-grow-1">
              <Form.Select aria-label="By system role" value={filters.role} onChange={(e) => setFilters({...filters, ...{role: e.target.value}})}>
                <option value={undefined}>-- by system role --</option>
                {Object.keys(authMap).map((key, idx) => {
                  return <option key={`role-${idx}`} value={key} >{key}</option>
                })}
              </Form.Select>
            </div>
          </div>
        </Form>
        
        <Table striped>
         <thead>
          <tr><th>Name</th><th>Email address</th><th>Role</th></tr>
        </thead> 
        <tbody>
          {userList.map(user => {
            return <UserListItem key={user._id} user={user} />
          })
          }
        </tbody>
        </Table>
        </>
    )

}

export default UserList;