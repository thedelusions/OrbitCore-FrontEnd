import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getProject, upvoteProject, downvoteProject, removeVote } from '../../../services/projectService';
import { getUserById } from '../../../services/userService';
import { UserContext } from '../../contexts/UserContext';
import Footer from '../Footer/Footer';
import './ProjectDetail.css';

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

  useEffect(() => {
    fetchProject();
  }, [id]);

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
              <button className="btn btn-primary" onClick={() => navigate(`/projects/${id}/edit`)}>
                Edit Project
              </button>
              <button className="btn btn-delete" onClick={() => setShowDeleteConfirm(true)}>
                Delete Project
              </button>
            </div>
          ) : user ? (
            <div className="project-actions">
              <button className="btn btn-primary">
                Join the Mission
              </button>
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
