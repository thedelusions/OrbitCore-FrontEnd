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
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('all');

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

  const filteredProjects = projects
    .filter(project => {
      const tagsArray = Array.isArray(project.tags) ? project.tags : (typeof project.tags === 'string' ? project.tags.split(',') : []);
      const tagsString = tagsArray.join(' ').toLowerCase();
      
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tagsString.includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'most-upvoted':
          return (b.upvotes || 0) - (a.upvotes || 0);
        default:
          return 0;
      }
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
            
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-upvoted">Most Upvoted</option>
            </select>
            
            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            
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
              
              {project.tags && project.tags.length > 0 && (
                <div className="project-tags">
                  {(Array.isArray(project.tags) ? project.tags : project.tags.split(',')).map((tag, index) => (
                    <span key={index} className="tag">{typeof tag === 'string' ? tag.trim() : tag}</span>
                  ))}
                </div>
              )}
              
              {project.members_roles && project.members_roles.length > 0 && (
                <div className="project-team-info">
                  <span className="team-info-item">
                    {project.members_roles.reduce((total, roleItem) => {
                      const count = typeof roleItem === 'object' && roleItem.count ? roleItem.count : 1;
                      return total + count;
                    }, 0)} positions
                  </span>
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
