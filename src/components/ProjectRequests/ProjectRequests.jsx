import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import Footer from '../Footer/Footer';
import './ProjectRequests.css';
import { getProjectRequests, respondToRequest } from '../../../services/requestService';
import { UserContext } from '../../contexts/UserContext';

const ProjectRequests = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [id]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getProjectRequests(id);
      setRequests(data);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId, status) => {
    try {
      await respondToRequest(requestId, status);
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
    } catch (err) {
      console.error('Failed to update request:', err);
    }
  };

  return (
    <>
      <div className="project-requests-container">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>Join Requests</h1>
        <p>View and manage join requests for this project.</p>

        {loading && <p className="loading-text">Loading requests...</p>}

        {!loading && requests.length === 0 && (
          <p className="no-results">No join requests yet.</p>
        )}

        <div className="requests-list">
          {requests.map(r => (
            <div key={r.id} className="request-card">
              <div className="request-header">
                <div>
                  <h3>{r.project?.title || 'Project'}</h3>
                  {r.user?.github_profile && (
                    <p className="github-link">{r.user.github_profile}</p>
                  )}
                </div>
                <span className={`status-badge status-${r.status}`}>{r.status}</span>
              </div>
              <div className="request-details">
                <div className="detail-item">
                  <span className="detail-label">Applicant:</span>
                  <span className="detail-value">{r.user?.username || 'Unknown user'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Role Applied For:</span>
                  <span className="detail-value">{r.role || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Applied Date:</span>
                  <span className="detail-value">{new Date(r.createdAt).toLocaleString()}</span>
                </div>
              </div>
              {r.message && (
                <div className="request-message">
                  <span className="detail-label">Message:</span>
                  <p>{r.message}</p>
                </div>
              )}
              {user && r.project && (user.id === r.project.ownerId || user.user_id === r.project.ownerId || user.userId === r.project.ownerId) && (
                <div className="request-actions">
                  {r.status !== 'accepted' && (
                    <button className="btn btn-primary" onClick={() => handleRespond(r.id, 'accepted')}>Accept</button>
                  )}
                  {r.status !== 'rejected' && (
                    <button className="btn btn-delete" onClick={() => handleRespond(r.id, 'rejected')}>Reject</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProjectRequests;
