import { Navigate, useOutlet, useLocation } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import MainNavigation from './MainNavigation';
import Footer from './Footer';
import './Layout.css';

/**
 * Wrapper for all pages that are only avaialble to logged-in users
 *
 * @returns {React.ReactElement}
 */
const ProtectedLayout = (props) => {

  const { user } = useAuth();
  const outlet = useOutlet();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }}  />;
  }

  return (
    <>
      <MainNavigation />
      <main className="container">{outlet}</main>
      <Footer />
    </>
  );
};

export default ProtectedLayout;

