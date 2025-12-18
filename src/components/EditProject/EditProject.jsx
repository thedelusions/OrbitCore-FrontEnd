import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getProject, updateProject } from '../../../services/projectService';
import { UserContext } from '../../contexts/UserContext';
import Footer from '../Footer/Footer';
import tagsData from '../../../data/tags.json';
import './EditProject.css';

const AVAILABLE_TAGS = tagsData.tags;

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    repo_link: ''
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await getProject(id);
      
      // Check if user is the owner
      const userId = user?.id || user?.user_id || user?.userId;
      if (data.ownerId !== userId) {
        setError('You are not authorized to edit this project');
        setLoading(false);
        return;
      }

      setFormData({
        title: data.title,
        description: data.description,
        status: data.status,
        repo_link: data.repo_link || ''
      });
      
      // Parse tags string into array
      if (data.tags) {
        const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        setSelectedTags(tagsArray);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
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
        status: formData.status,
        tags: selectedTags.length > 0 ? selectedTags.join(',') : null,
        repo_link: formData.repo_link || null
      };

      await updateProject(id, projectData);
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <>
        <div className="edit-project-container">
          <p className="error-text">Please log in to edit projects</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div className="edit-project-container">
          <p className="loading-text">Loading project...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="edit-project-container">
          <p className="error-text">{error}</p>
          <button className="btn btn-secondary" onClick={() => navigate('/projects')}>
            Back to Projects
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="edit-project-container">
        <button className="back-button" onClick={() => navigate(`/projects/${id}`)}>
          ← Back to Project
        </button>

        <h1>Edit Project</h1>

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
            <label>Tags</label>
            <div className="tags-selector">
              <div className="selected-tags">
                {selectedTags.map(tag => (
                  <span key={tag} className="selected-tag">
                    {tag}
                    <button 
                      type="button" 
                      className="remove-tag"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button 
                  type="button" 
                  className="add-tag-button"
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                >
                  + Add Tag
                </button>
              </div>
              {showTagDropdown && (
                <div className="tag-dropdown">
                  {AVAILABLE_TAGS.map(tag => (
                    <label key={tag} className="tag-option">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <small className="form-hint">Select one or more tags</small>
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
            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/projects/${id}`)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditProject;
