import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getCurrentUser } from '../../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import Footer from '../Footer/Footer';
import rolesData from '../../../data/roles.json';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    github_profile: ''
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
          setSelectedRoles(userData.roles || []);
          setFormData({
            bio: userData.bio || '',
            github_profile: userData.github_profile || ''
          });
        } else {
          navigate('/login');
        }
      } else {
        setSelectedRoles(user.roles || []);
        setFormData({
          bio: user.bio || '',
          github_profile: user.github_profile || ''
        });
      }
    };

    loadUserProfile();
  }, [user, setUser, navigate]);

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
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage('Not authenticated');
        navigate('/login');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roles: selectedRoles,
          bio: formData.bio,
          github_profile: formData.github_profile
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleCancel = () => {
    setSelectedRoles(user.roles || []);
    setFormData({
      bio: user.bio || '',
      github_profile: user.github_profile || ''
    });
    setIsEditing(false);
    setShowRoleDropdown(false);
    setMessage('');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <main className="profile-container">
        <div className="profile-card">
          <h1>User Profile</h1>
          
          {message && <p className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</p>}

          <div className="profile-info">
            <div className="profile-field">
              <label>Username:</label>
              <p>{user.username}</p>
            </div>

            <div className="profile-field">
              <label>Email:</label>
              <p>{user.email}</p>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="profile-field">
                  <label>Roles (1-3 required):</label>
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
                  <small className="form-hint">Select 1-3 roles</small>
                </div>

                <div className="profile-field">
                  <label htmlFor="bio">Bio:</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="github_profile">GitHub Profile:</label>
                  <input
                    type="text"
                    id="github_profile"
                    name="github_profile"
                    value={formData.github_profile}
                    onChange={handleChange}
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                <div className="profile-actions">
                  <button type="submit" className="btn-save">Save Changes</button>
                  <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="profile-field">
                  <label>Roles:</label>
                  <div className="roles-display">
                    {user.roles && user.roles.length > 0 ? (
                      user.roles.map((role, index) => (
                        <span key={index} className="role-badge">{role}</span>
                      ))
                    ) : (
                      <p>Not specified</p>
                    )}
                  </div>
                </div>

                <div className="profile-field">
                  <label>Bio:</label>
                  <p>{user.bio || 'No bio added yet'}</p>
                </div>

                <div className="profile-field">
                  <label>GitHub Profile:</label>
                  <p>
                    {user.github_profile ? (
                      <a href={user.github_profile} target="_blank" rel="noopener noreferrer">
                        {user.github_profile}
                      </a>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>

                <div className="profile-actions">
                  <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
