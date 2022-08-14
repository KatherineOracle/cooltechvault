

import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/**
 * Displays welcome message for administrators
 *
 * @returns {React.ReactElement}
 */
const AdminHome = () => {
  const { user } = useAuth();

  return (
    <section>
    <section>
      <h1>Howdy {user.realName}</h1>
      <p className="lead">You have entered the CoolTech Vault, I see you are an administrator here!</p>

      <h2>What you can do:</h2>
      <ul>
        <li>View and update your <Link to="/profile">PROFILE</Link> </li>
        <li>View, add, edit <Link to="/credentials">CREDENTIALS</Link> for all departments</li>
        <li>Add, and edit departments under <Link to="/divisions">DIVISIONS</Link> </li>
        <li>Add,  edit and update  <Link to="/divisions">USERS</Link> </li>
      </ul>
      <hr/>
      <p>Please contact the <a href={`mailto:${process.env.REACT_APP_ADMIN_EMAIL}`}>administrator</a> if you have any issues... oh no wait, thats you!</p>
    </section>
    </section>
  );
};

export default AdminHome;
