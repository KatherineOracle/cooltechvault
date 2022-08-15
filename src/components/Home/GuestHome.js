
import useAuth from "../../hooks/useAuth";


/**
 * Displays welcome message for guests 
 *
 * @returns {React.ReactElement}
 */
const GuestHome = () => { 
  const { user } = useAuth();

  return (
    <section>
      <h1>Howdy {user.realName}</h1>
      <p className="lead">You have entered the CoolTech Vault, I see you are an guest here!</p>

        <p>You will need to wait for the administrator to grant you access to information on the system.</p>

      <hr/>
      <p>Please contact the <a href={`mailto:${process.env.REACT_APP_ADMIN_EMAIL}`}>administrator</a> for further assistance.</p>
    </section>
  );
};

export default GuestHome;
