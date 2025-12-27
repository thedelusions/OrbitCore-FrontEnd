import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signUp, getCurrentUser } from '../../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import Footer from '../Footer/Footer';
import rolesData from '../../../data/roles.json';

import './Register.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConf: '',
    bio: '',
    github_profile: ''
  });
  

  const { username, email, password, passwordConf, bio, github_profile } = formData;
  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleRoleToggle = (role) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      } else if (prev.length < 3) {
        return [...prev, role];
      } else {
        return prev;
      }
    });
  };

  const handleRemoveRole = (role) => {
    setSelectedRoles(prev => prev.filter(r => r !== role));
  };

 const handleSubmit = async (evt) => {
    evt.preventDefault();
    
    if (selectedRoles.length === 0) {
      setMessage('At least 1 role is required');
      return;
    }
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
  }
    
    try {
      const data = await signUp({ ...formData, roles: selectedRoles });
      
      
     
      localStorage.setItem('token', data.token);
      const user = await getCurrentUser();
      setUser(user);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setMessage(err.message || 'Registration failed. Please check your information.');
    }
  };

  const isFormInvalid = () => {
    return !(username && email && password && password === passwordConf && selectedRoles.length > 0);
  };

  return (
    <>
    <main className='main'>
      <div className="form-container">
        <div className="form-wrapper">
        <h1>Sign Up</h1>
        {message && <p className={message.includes('successful') ? 'success-message' : 'error-message'}>{message}</p>}
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
            <label htmlFor='bio'>Bio</label>
            <textarea
              id='bio'
              value={bio}
              name='bio'
              onChange={handleChange}
              rows="3"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="form-group">
            <label htmlFor='github_profile'>Github Profile Link</label>
            <input
              type='url'
              id='github_profile'
              value={github_profile}
              name='github_profile'
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>
          <div className="form-group">
            <label>Roles (1-3 required)</label>
            <div className="roles-selector">
              <div className="selected-roles">
                {selectedRoles.map(role => (
                  <span key={role} className="selected-role">
                    {role}
                    <button 
                      type="button" 
                      className="remove-role"
                      onClick={() => handleRemoveRole(role)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedRoles.length < 3 && (
                  <button 
                    type="button" 
                    className="add-role-button"
                    onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  >
                    + Add Role
                  </button>
                )}
              </div>
              {showRoleDropdown && (
                <div className="role-dropdown">
                  {rolesData.roles.map(role => (
                    <label key={role} className="role-option">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role)}
                        onChange={() => handleRoleToggle(role)}
                        disabled={!selectedRoles.includes(role) && selectedRoles.length >= 3}
                      />
                      <span>{role}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <small className="form-hint">Select 1-3 roles that best describe you</small>
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
