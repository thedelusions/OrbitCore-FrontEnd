import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getAllProjects } from '../../../services/projectService';
import Footer from '../Footer/Footer';
import './Projects.css';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const tagsArray = typeof project.tags === 'string' ? project.tags.split(',') : project.tags || [];
    const tagsString = tagsArray.join(' ').toLowerCase();
    
    return project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tagsString.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div className="projects-container">
        <div className="projects-header">
          <h1>Browse Projects</h1>
          <p>Discover ideas and find your next collaboration</p>
          
          <div className="projects-controls">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/projects/new')}
            >
              Post Project
            </button>
          </div>
        </div>

        {loading && <p className="loading-text">Loading projects...</p>}
        
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && filteredProjects.length === 0 && (
          <p className="no-results">No projects found. Be the first to post one!</p>
        )}

        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="project-card"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="project-card-header">
                <h3>{project.title}</h3>
                <span className={`status-badge status-${project.status}`}>
                  {project.status}
                </span>
              </div>
              
              <p className="project-description">{project.description}</p>
              
              {project.tags && (
                <div className="project-tags">
                  {(typeof project.tags === 'string' ? project.tags.split(',') : project.tags).map((tag, index) => (
                    <span key={index} className="tag">{tag.trim()}</span>
                  ))}
                </div>
              )}
              
              <div className="project-footer">
                <div className="vote-stats">
                  <span className="upvotes">↑ {project.upvotes || 0}</span>
                  <span className="downvotes">↓ {project.downvotes || 0}</span>
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

export default Projects;
