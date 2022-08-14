import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './icons/fontello.css';
import App from './App';
import { ToastProvider } from './context/ToastProvider';
import { AuthProvider } from './context/AuthProvider';
import ToastStack from './components/Toasts/ToastStack';

/**
 * Renders root of application, 
 * wrapping app with the ToastProvider and AuthProvider 
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
  <ToastProvider>
  <AuthProvider>
    <App />
    <ToastStack />  
  </AuthProvider>
  </ToastProvider>
  </BrowserRouter>

);
