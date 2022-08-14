import { Link } from "react-router-dom";

/**
 * Returns a single user displayed as a table row to the parent Userlist component
 * 
 * @returns {React.ReactElement}
 */
const UserListItem = ({user}) => {

    return(
        <tr><td><Link to={'user/'+user._id}>{user.realName}</Link></td><td>{user.email}</td><td>{user.role}</td></tr>  
    )

}

export default UserListItem;