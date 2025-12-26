import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { createProject } from '../../../services/projectService';
import { UserContext } from '../../contexts/UserContext';
import Footer from '../Footer/Footer';
import tagsData from '../../../data/tags.json';
import rolesData from '../../../data/roles.json';
import './CreateProject.css';

const AVAILABLE_TAGS = tagsData.tags;
const AVAILABLE_ROLES = rolesData.roles;

const CreateProject = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [error, setError] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    repo_link: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else if (prev.length < 5) {
        return [...prev, tag];
      } else {
        return prev;
      }
    });
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleAddRole = (roleName) => {
    setSelectedRoles(prev => {
      const existing = prev.find(r => r.role === roleName);
      if (existing) {
        return prev;
      }
      return [...prev, { role: roleName, count: 1 }];
    });
  };

  const handleRoleCountChange = (roleName, delta) => {
    setSelectedRoles(prev => {
      return prev.map(r => {
        if (r.role === roleName) {
          const newCount = Math.max(1, r.count + delta);
          return { ...r, count: newCount };
        }
        return r;
      });
    });
  };

  const handleRemoveRole = (roleName) => {
    setSelectedRoles(prev => prev.filter(r => r.role !== roleName));
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

    if (selectedTags.length === 0) {
      setError('At least 1 tag is required');
      return;
    }

    if (selectedTags.length > 5) {
      setError('Maximum 5 tags allowed');
      return;
    }

    try {
      const totalMembers = selectedRoles.reduce((sum, roleObj) => sum + roleObj.count, 0);
      
      const projectData = {
        title: formData.title,
        description: formData.description,
        ownerId: userId,
        status: formData.status,
        tags: selectedTags,
        repo_link: formData.repo_link || null,
        required_members: totalMembers > 0 ? totalMembers : null,
        members_roles: selectedRoles
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
            <label>Tags (1-5 required) *</label>
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
                {selectedTags.length < 5 && (
                  <button 
                    type="button" 
                    className="add-tag-button"
                    onClick={() => setShowTagDropdown(!showTagDropdown)}
                  >
                    + Add Tag
                  </button>
                )}
              </div>
              {showTagDropdown && (
                <div className="tag-dropdown">
                  {AVAILABLE_TAGS.map(tag => (
                    <label key={tag} className="tag-option">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        disabled={!selectedTags.includes(tag) && selectedTags.length >= 5}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <small className="form-hint">Select 1-5 tags</small>
          </div>

          <div className="form-group">
            <label>What roles are you looking for?</label>
            <div className="roles-selector">
              <div className="selected-roles-list">
                {selectedRoles.map(roleObj => (
                  <div key={roleObj.role} className="role-count-item">
                    <span className="role-name">{roleObj.role}</span>
                    <div className="role-controls">
                      <button 
                        type="button" 
                        className="count-button"
                        onClick={() => handleRoleCountChange(roleObj.role, -1)}
                      >
                        −
                      </button>
                      <span className="role-count">{roleObj.count}</span>
                      <button 
                        type="button" 
                        className="count-button"
                        onClick={() => handleRoleCountChange(roleObj.role, 1)}
                      >
                        +
                      </button>
                      <button 
                        type="button" 
                        className="remove-role-button"
                        onClick={() => handleRemoveRole(roleObj.role)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="role-dropdown-container">
                <button 
                  type="button" 
                  className="add-tag-button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                >
                  + Add Role
                </button>
                {showRoleDropdown && (
                  <div className="tag-dropdown">
                    {AVAILABLE_ROLES.filter(role => !selectedRoles.find(r => r.role === role)).map(role => (
                      <button
                        key={role}
                        type="button"
                        className="role-dropdown-item"
                        onClick={() => {
                          handleAddRole(role);
                          setShowRoleDropdown(false);
                        }}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <small className="form-hint">Optional: Select the roles needed for your team and specify quantities</small>
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
