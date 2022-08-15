import AdminHome from '../components/Home/AdminHome';
import ManagerHome from '../components/Home/ManagerHome';
import EmployeeHome from '../components/Home/EmployeeHome';
import GuestHome from '../components/Home/GuestHome';
import useAuth from "../hooks/useAuth";

/**
 * Container Page for / route
 * returns different components based on user role
 * @returns {React.ReactElement}
 */
const HomePage = () => {
  const { user } = useAuth();
  if(user.role === "administrator") return <AdminHome />;
  if(user.role === "manager") return <ManagerHome />;
  if(user.role === "employee") return <EmployeeHome />;
  if(user.role === "guest") return <GuestHome />;
};

export default HomePage;
