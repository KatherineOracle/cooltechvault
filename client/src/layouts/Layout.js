
import { useOutlet } from "react-router-dom";
import MainNavigation from './MainNavigation';
import Footer from './Footer';
import './Layout.css';

/**
 * Wrapper for all "public" pages that do not require authentication 
 *
 * @returns {React.ReactElement}
 */
const Layout = () => {
  const outlet = useOutlet();

  return (
    <>
      <MainNavigation />
      <main className="container">{outlet}</main>
      <Footer />
    </>
  );
};

export default Layout;
