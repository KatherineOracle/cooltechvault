
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";


/**
 * Displays welcome message for employees
 *
 * @returns {React.ReactElement}
 */
const EmployeeHome = () => { 
    const { user } = useAuth();

  return (
    <section>
      <h1>Howdy {user.realName}</h1>
      <p className="lead">You have entered the CoolTech Vault, I see you are an employee here!</p>

      <h2>What you can do:</h2>
      <ul>
        <li>View and update your <Link to="/profile">PROFILE</Link> </li>
        <li>View  <Link to="/credentials">CREDENTIALS</Link> for your departments</li>
      </ul>
      <hr/>
      <p>Please contact the <a href={`mailto:${process.env.REACT_APP_ADMIN_EMAIL}`}>administrator</a> if you have any issues.</p>
    </section>
  );
};

export default EmployeeHome;
