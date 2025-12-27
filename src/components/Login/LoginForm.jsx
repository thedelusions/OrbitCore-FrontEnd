import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signIn, getCurrentUser } from '../../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import Footer from '../Footer/Footer';
import './LoginForm.css';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { username, password } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const data = await signIn(formData);
      
      // Check if login response includes user data
      if (data.user || data.id || data.user_id || data.userId) {
        const userData = data.user || data;
        setUser(userData);
        navigate('/');
      } else {
        // Fetch full user data including ID before navigating
        const userData = await getCurrentUser();
        
        if (userData) {
          setUser(userData);
          navigate('/');
        } else {
          setMessage('Failed to fetch user profile');
        }
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password);
  };

  return (
    <>
      <main className='main'>
        <div className="form-container">
          <div className="form-wrapper">
            <h1>Login</h1>
            {message && <p className="error-message">{message}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor='username'>Username</label>
                <input
                  type='text'
                  id='username'
                  value={username}
                  name='username'
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  id='password'
                  value={password}
                  name='password'
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="btn-primary" disabled={isFormInvalid()}>
                  Login
                </button>
                <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
                  Cancel
                </button>
              </div>
              <div className="form-footer">
                <p>
                  Don't have an account?{' '}
                  <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
                    Register Now
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
