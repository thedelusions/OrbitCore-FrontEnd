import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getProject, upvoteProject, downvoteProject, removeVote } from '../../../services/projectService';
import { createRequest } from '../../../services/requestService';
import { getUserById } from '../../../services/userService';
import { UserContext } from '../../contexts/UserContext';
import Footer from '../Footer/Footer';
import './ProjectDetail.css';
import roles from '../../../data/roles.json';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [project, setProject] = useState(null);
  const [ownerName, setOwnerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userVoteType, setUserVoteType] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [message, setMessage] = useState(''); // optional message input
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (!project || !user) return;
    const uid = user.id || user.user_id || user.userId;
    if (!uid) return;
    const existing = Array.isArray(project.requests)
      ? project.requests.find(r => r.user_id === uid)
      : null;
    setRequestSent(!!existing);
  }, [project, user]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await getProject(id);
      setProject(data);
      
      // Fetch owner username
      if (data.ownerId) {
        try {
          const ownerData = await getUserById(data.ownerId);
          setOwnerName(ownerData.username || 'Unknown');
        } catch (err) {
          console.error('Failed to fetch owner:', err);
          setOwnerName('Unknown');
        }
      }
      
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const userId = user.id || user.user_id || user.userId;
    if (!userId) {
      setActionError('User ID not found. Please log in again.');
      return;
    }
    try {
      setActionError('');
      
      if (userVoteType === 'upvote') {
        const updatedProject = await removeVote(id, userId);
        setProject(updatedProject);
        setUserVoteType(null);
      } else {
        const updatedProject = await upvoteProject(id, userId);
        setProject(updatedProject);
        setUserVoteType('upvote');
      }
    } catch (err) {
      if (err.message.includes('already upvoted')) {
        try {
          const updatedProject = await removeVote(id, userId);
          setProject(updatedProject);
          setUserVoteType(null);
        } catch (removeErr) {
          setActionError(removeErr.message);
        }
      } else {
        setActionError(err.message);
      }
    }
  };

  const handleDownvote = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const userId = user.id || user.user_id || user.userId;
    if (!userId) {
      setActionError('User ID not found. Please log in again.');
      return;
    }
    try {
      setActionError('');
      
      if (userVoteType === 'downvote') {
        const updatedProject = await removeVote(id, userId);
        setProject(updatedProject);
        setUserVoteType(null);
      } else {
        const updatedProject = await downvoteProject(id, userId);
        setProject(updatedProject);
        setUserVoteType('downvote');
      }
    } catch (err) {
      if (err.message.includes('already downvoted')) {
        try {
          const updatedProject = await removeVote(id, userId);
          setProject(updatedProject);
          setUserVoteType(null);
        } catch (removeErr) {
          setActionError(removeErr.message);
        }
      } else {
        setActionError(err.message);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      navigate('/projects');
    } catch (err) {
      setActionError(err.message);
      setShowDeleteConfirm(false);
    }
  };

  const handleSendJoinRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const uid = user.id || user.user_id || user.userId;
    if (!uid) {
      setActionError('User ID not found. Please log in again.');
      return;
    }

    if (requestSent) return;

    const userRoles = user.roles || [];
    if (!userRoles.includes(selectedRole)) {
      setActionError('You do not have the selected role in your profile. Please update your profile first.');
      return;
    }

    try {
      setSendingRequest(true);
      if (!selectedRole) {
        setActionError('Please choose a role before sending your request.');
        setSendingRequest(false);
        return;
      }
      const created = await createRequest(id, message || null, selectedRole); // send role + optional message
      setRequestSent(true);
      setProject(prev => ({ ...prev, requests: prev?.requests ? [...prev.requests, created] : [created] }));
      setMessage(''); // clear input after sending
      setSelectedRole('');
      setActionError('');
    } catch (err) {
      const msg = err?.message || 'Failed to send request';
      setActionError(msg);
    } finally {
      setSendingRequest(false);
    }
  };


  if (loading) {
    return (
      <>
        <div className="project-detail-container">
          <p className="loading-text">Loading project...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="project-detail-container">
          <p className="error-text">{error}</p>
          <button className="btn btn-secondary" onClick={() => navigate('/projects')}>
            Back to Projects
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <div className="project-detail-container">
          <p className="error-text">Project not found</p>
          <button className="btn btn-secondary" onClick={() => navigate('/projects')}>
            Back to Projects
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const tagsArray = typeof project.tags === 'string' ? project.tags.split(',') : project.tags || [];

  return (
    <>
      <div className="project-detail-container">
        <button className="back-button" onClick={() => navigate('/projects')}>
          ← Back to Projects
        </button>

        {actionError && (
          <div className="action-error-message">
            {actionError}
            <button className="close-error" onClick={() => setActionError('')}>×</button>
          </div>
        )}

        <div className="project-detail-header">
          <div className="project-title-section">
            <h1>{project.title}</h1>
            <span className={`status-badge status-${project.status}`}>
              {project.status}
            </span>
          </div>

          <div className="project-votes">
            <button 
              className={`vote-button upvote-button ${userVoteType === 'upvote' ? 'active' : ''}`}
              onClick={handleUpvote}
              disabled={!user}
            >
              ↑ {project.upvotes || 0}
            </button>
            <button 
              className={`vote-button downvote-button ${userVoteType === 'downvote' ? 'active' : ''}`}
              onClick={handleDownvote}
              disabled={!user}
            >
              ↓ {project.downvotes || 0}
            </button>
          </div>
        </div>

        {tagsArray.length > 0 && (
          <div className="project-tags-detail">
            {tagsArray.map((tag, index) => (
              <span key={index} className="tag">{tag.trim()}</span>
            ))}
          </div>
        )}

        <div className="project-content">
          <h2>Description</h2>
          <p className="project-description-full">{project.description}</p>

          {project.repo_link && (
            <div className="project-repo">
              <h3>Repository</h3>
              <a href={project.repo_link} target="_blank" rel="noopener noreferrer" className="repo-link">
                Visit Repository
              </a>
            </div>
          )}

          {project.members_roles && project.members_roles.length > 0 && (
            <div className="project-team-needs">
              <h3>Team Needs</h3>
              <div className="team-need-item">
                <span className="need-label">Looking for:</span>
                <div className="roles-list">
                  {project.members_roles.map((roleItem, index) => {
                    const roleName = typeof roleItem === 'string' ? roleItem : roleItem.role;
                    const count = typeof roleItem === 'object' && roleItem.count ? roleItem.count : 1;
                    return (
                      <span key={index} className="role-badge">
                        {roleName} {count > 1 && `(${count})`}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="project-meta">
            <div className="meta-item">
              <span className="meta-label">Owner:</span>
              <span className="meta-value">
                <a 
                  href={`/users/${project.ownerId}`} 
                  onClick={(e) => { e.preventDefault(); navigate(`/users/${project.ownerId}`); }}
                  className="owner-link"
                >
                  {ownerName || 'Loading...'}
                </a>
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Status:</span>
              <span className="meta-value">{project.status}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Created:</span>
              <span className="meta-value">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Last Updated:</span>
              <span className="meta-value">
                {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {user && (user.id === project.ownerId || user.user_id === project.ownerId || user.userId === project.ownerId) ? (
            <div className="owner-actions">
              <button className="btn btn-primary" onClick={() => navigate(`/projects/${id}/team`)}>
                View Team
            </button>
              <button className="btn btn-primary" onClick={() => navigate(`/projects/${id}/edit`)}>
                Edit Project
              </button>
              <button className="btn btn-secondary" onClick={() => navigate(`/projects/${id}/requests`)}>
                View Join Requests
              </button>
              <button className="btn btn-delete" onClick={() => setShowDeleteConfirm(true)}>
                Delete Project
              </button>
            </div>
          ) : user ? (
            <div className="project-actions">
              <div className="user-roles-display">
                <span className="roles-label">Your Roles:</span>
                <div className="roles-tags">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <span key={role} className="role-tag">{role}</span>
                    ))
                  ) : (
                    <span className="no-roles-text">No roles added to profile</span>
                  )}
                </div>
              </div>
              
              {(() => {
                const projectRequiredRoles = project.members_roles
                  ? project.members_roles.map(r => typeof r === 'string' ? r : r.role)
                  : [];
                const userRoles = user.roles || [];
                const matchingRoles = userRoles.filter(role => projectRequiredRoles.includes(role));
                const hasMatchingRoles = matchingRoles.length > 0;
                
                return (
                  <>
                    {!hasMatchingRoles && projectRequiredRoles.length > 0 && (
                      <div className="no-matching-roles-message">
                        <p>You don't have any of the required roles for this project.</p>
                        <p className="required-roles-text">
                          This project is looking for: <strong>{projectRequiredRoles.join(', ')}</strong>
                        </p>
                      </div>
                    )}
                    
                    {hasMatchingRoles && (
                      <>
                        <div className="role-row">
                          <select
                            className="role-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                          >
                            <option value="">Select role to apply for</option>
                            {matchingRoles.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={() => { setSelectedRole(''); setMessage(''); }}
                          >
                            Clear
                          </button>
                        </div>
                        <textarea
                          className="request-message"
                          placeholder="Optional message (explain why you want to join / relevant experience)"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={handleSendJoinRequest}
                          disabled={requestSent || sendingRequest || !selectedRole}
                        >
                          {requestSent ? 'Request Sent' : sendingRequest ? 'Sending...' : 'Join Project'}
                        </button>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
          ) : null}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Project</h3>
            <p>Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProjectDetail;
