import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import Footer from '../Footer/Footer';
import './MyRequests.css';
import { getMyRequests } from '../../../services/requestService';
import { UserContext } from '../../contexts/UserContext';

const MyRequests = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const data = await getMyRequests();
      setRequests(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load your requests');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <div className="my-requests-container">
          <p className="error-text">Please log in to view your join requests.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="my-requests-container">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>My Join Requests</h1>
        <p>View all the project requests you have applied for.</p>

        {loading && <p className="loading-text">Loading requests...</p>}

        {!loading && requests.length === 0 && (
          <p className="no-results">No requests yet.</p>
        )}

        {error && <p className="error-text">{error}</p>}

        <div className="my-requests-list">
          {requests.map(r => (
            <div key={r.id} className="my-request-card">
              <div className="request-row">
                <div className="request-col">
                  <span className="col-label">Project Name:</span>
                  <span className="col-value">{r.project?.title || 'Project'}</span>
                </div>
                <div className="request-col">
                  <span className="col-label">Status:</span>
                  <span className={`col-value status-${r.status}`}>{r.status}</span>
                </div>
                <div className="request-col">
                  <span className="col-label">Applied Date:</span>
                  <span className="col-value">{new Date(r.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyRequests;
