import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { createProject } from '../../../services/projectService';
import { UserContext } from '../../contexts/UserContext';
import Footer from '../Footer/Footer';
import './CreateProject.css';

const CreateProject = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    tags: '',
    repo_link: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    const userId = user.id || user.user_id || user.userId;
    if (!userId) {
      setError('User ID not found. Please log in again.');
      return;
    }

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        ownerId: userId,
        status: formData.status,
        tags: formData.tags || null,
        repo_link: formData.repo_link || null
      };

      const newProject = await createProject(projectData);
      navigate(`/projects/${newProject.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <>
        <div className="create-project-container">
          <p className="error-text">Please log in to create a project</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="create-project-container">
        <button className="back-button" onClick={() => navigate('/projects')}>
          ← Back to Projects
        </button>

        <h1>Create New Project</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label htmlFor="title">Project Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter project title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Describe your project..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Web,AI,Mobile (comma-separated)"
            />
            <small className="form-hint">Separate tags with commas</small>
          </div>

          <div className="form-group">
            <label htmlFor="repo_link">Repository Link</label>
            <input
              type="url"
              id="repo_link"
              name="repo_link"
              value={formData.repo_link}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/projects')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Project
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateProject;
