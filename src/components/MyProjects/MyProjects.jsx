import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import Footer from '../Footer/Footer';
import { getUserProjects } from '../../../services/projectService';
import { UserContext } from '../../contexts/UserContext';
import './MyProjects.css';

const MyProjects = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getUserProjects();
        setProjects(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Oops! Could not load your projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (!user) {
    return (
      <>
        <div className="my-projects-container">
          <p className="error-text">Please log in to see your projects.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="my-projects-container">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>My Projects</h1>
        <p>Here are the projects you’ve created so far.</p>

        {loading && <p className="loading-text">Loading your projects...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && projects.length === 0 && (
          <div className="no-results-container">
            <p className="no-results">No projects yet. Start your first one!</p>
            <button 
              className="btn btn-primary create-btn"
              onClick={() => navigate('/projects/new')}
            >
              Create Project
            </button>
          </div>
        )}

        <div className="my-projects-list">
          {projects.map(project => {
            const tags = Array.isArray(project.tags) ? project.tags : (project.tags || '').split(',');
            return (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className={`status-badge status-${project.status}`}>{project.status}</span>
                </div>

                <p className="project-description">
                  {project.description ? project.description.slice(0, 150) + '...' : 'No description yet.'}
                </p>

                <div className="project-details">
                  <div className="detail-item">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Roles Needed:</span>
                    <span className="detail-value">{project.members_roles?.length || 0}</span>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="project-tags">
                    {tags.map((tag, idx) => <span key={idx} className="tag">{tag.trim()}</span>)}
                  </div>
                )}

                <div className="project-actions">
                  <button className="btn btn-primary" onClick={() => navigate(`/projects/${project.id}`)}>View</button>
                  <button className="btn btn-primary" onClick={() => navigate(`/projects/${project.id}/edit`)}>Edit</button>
                  <button className="btn btn-secondary" onClick={() => navigate(`/projects/${project.id}/requests`)}>Requests</button>
                  <button className="btn btn-secondary" onClick={() => navigate(`/projects/${project.id}/team`)}>Team</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyProjects;
