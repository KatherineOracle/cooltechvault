import { NavLink, Link } from "react-router-dom";
import useAuth  from '../hooks/useAuth'; 
import {Nav, Navbar, Container, Button } from "react-bootstrap";
import logo from "./tiny-logo.svg";

/**
 * Returns header element with main navigation. 
 * Elements are shown or hidden based on user status and role
 *
 * @returns {React.ReactElement}
 */
const MainNavigation = () => {
  const {user, hasPermissionLevel, logout} = useAuth();

  const handleLogout = () => { 
    logout(false); //logout (not silent)   
  }

  return (
<header className="main-navigation">
    <Navbar expand="lg">
      <Container>
        <Link className="navbar-brand" to="/"><img alt="Cooltech logo" src={logo} /> Vault</Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {(user) && 
            <NavLink className={(navData) => (navData.isActive ? "nav-link active" : 'nav-link')} to="/" >
              Home</NavLink>   
            }   
            {(hasPermissionLevel(1)) &&
            <NavLink className={(navData) => (navData.isActive ? "nav-link active" : 'nav-link')}
              to="/credentials">Credentials</NavLink>
            }
            {(hasPermissionLevel(3)) && 
              <NavLink className={(navData) => (navData.isActive ? "nav-link active" : 'nav-link')}
              to="/divisions">Divisions</NavLink> 
            } 
            {(hasPermissionLevel(3)) &&  
            <NavLink className={(navData) => (navData.isActive ? "nav-link active" : 'nav-link')}
              to="/users">Users</NavLink>  
            }        
          </Nav>
          <Nav>
            {(!user) && 
              <NavLink className={(navData) => (navData.isActive ? "nav-link active" : 'nav-link')} 
              to="/login">Please, log in</NavLink>
            }
            {(user) && 
              <NavLink className={(navData) => (navData.isActive ? "nav-link active" : 'nav-link')} 
              to="/profile">Profile</NavLink>
            }
            {(user) && 
            <Button color="inherit" onClick={handleLogout}>LOG OUT</Button>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </header>    

  );
};

export default MainNavigation;
