
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import ProtectedLayout from './layouts/ProtectedLayout';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import PageNotFound from './pages/PageNotFound';
import CredentialsPage from './pages/CredentialsPage';
import UsersPage from './pages/UsersPage';
import UserPage from './pages/UserPage';
import DivisionsPage from './pages/DivisionsPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';


/**
 * Establishes all known routes 
 *
 * @returns {React.ReactElement}
 */
function App() {

  return (

    <Routes>    
    <Route element={<ProtectedLayout />} >
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/credentials" element={<CredentialsPage />} />
      <Route path="/credentials/:division" element={<CredentialsPage />} />
      <Route path="/credentials/:division/:department" element={<CredentialsPage />} />
      <Route exact path="/users/user/:id" element={<UserPage />} />
      <Route exact path="/users" element={<UsersPage />} />
      <Route path="/divisions" element={<DivisionsPage />} />
    </Route>
    <Route element={<Layout />} >
        <Route path="/login" element={<Login />} />
        <Route path="/register"  element={<Register />} />  
        <Route path="*"  element={<PageNotFound />} />  
    </Route>          
  </Routes>

  );
}

export default App;
