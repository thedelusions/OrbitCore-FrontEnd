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
  const [formData, setFormData] = useState({
    role: '',
    bio: '',
    github_profile: ''
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
          setFormData({
            role: userData.role || '',
            bio: userData.bio || '',
            github_profile: userData.github_profile || ''
          });
        } else {
          navigate('/login');
        }
      } else {
        setFormData({
          role: user.role || '',
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

  const handleSubmit = async (evt) => {
    evt.preventDefault();
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
          role: formData.role,
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
    setFormData({
      role: user.role || '',
      bio: user.bio || '',
      github_profile: user.github_profile || ''
    });
    setIsEditing(false);
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
                  <label htmlFor="role">Role:</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">Select a role</option>
                    {rolesData.roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
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
                  <label>Role:</label>
                  <p>{user.role || 'Not specified'}</p>
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
