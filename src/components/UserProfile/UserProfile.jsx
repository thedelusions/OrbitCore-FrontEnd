import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import Footer from '../Footer/Footer';
import './UserProfile.css';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${id}`);
        
        if (!response.ok) {
          throw new Error('User not found');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="user-profile-container">
          <div className="profile-card">
            <div className="error-message">{error}</div>
            <button className="btn-back" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="user-profile-container">
        <div className="profile-card">
          <h1>{user.username}'s Profile</h1>
          
          <div className="profile-info">
            <div className="profile-field">
              <label>Username:</label>
              <p>{user.username}</p>
            </div>

            <div className="profile-field">
              <label>Email:</label>
              <p>{user.email}</p>
            </div>

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
          </div>

          <div className="profile-actions">
            <button className="btn-back" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UserProfile;
