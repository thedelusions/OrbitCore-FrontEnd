import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import Footer from '../Footer/Footer';
import roles from '../../../data/roles.json';
import './Register.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConf: '',
    role: '',
    bio: '',
    github_profile: ''
  });


  const { username, email, password, passwordConf, role, bio, github_profile } = formData;
  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

 const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const data = await signUp(formData);
      console.log('Registration response:', data);
      
      if (data.token || data.access_token) {
        const token = data.token || data.access_token;
        localStorage.setItem('token', token);
      }
      
      // Store user data
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else if (data.username) {
        // If user data is directly in response
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      }
      
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && email && password && password === passwordConf && role && bio && github_profile);
  };

  return (
    <>
    <main className='main'>
      <div className="form-container">
        <div className="form-wrapper">
        <h1>Sign Up</h1>
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
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              value={email}
              name='email'
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
          <div className="form-group">
            <label htmlFor='confirm'>Confirm Password</label>
            <input
              type='password'
              id='confirm'
              value={passwordConf}
              name='passwordConf'
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor='github_profile'>Github Profile Link</label>
            <input
              type='text'
              id='github_profile'
              value={github_profile}
              name='github_profile'
              onChange={handleChange}
              required
            />
          </div>
           <div className="form-group">
            <label htmlFor='bio'>Bio</label>
            <input
              type='text'
              id='bio'
              value={bio}
              name='bio'
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor='role'>Role</label>
            <select
              id='role'
              value={role}
              name='role'
              onChange={handleChange}
              required
            >
              <option value=''>Select your role</option>
              {Object.values(roles).flat().sort().map((roles) => (
                <option key={roles} value={roles}>
                  {roles}
                </option>
              ))}
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-primary" disabled={isFormInvalid()}>Register</button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
};

export default RegisterForm;
