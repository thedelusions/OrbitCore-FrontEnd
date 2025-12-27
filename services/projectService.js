const BASE_URL = 'http://127.0.0.1:8000/api/projects';

export const getAllProjects = async () => {
  try {
    // The projects router is mounted at /api/projects with route "/"
    const response = await fetch(`${BASE_URL}/`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to fetch projects');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
};

export const getProject = async (projectId) => {
  try {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/${projectId}`, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch project');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const createProject = async (projectData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create project');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const upvoteProject = async (projectId, userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/${projectId}/upvote/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to upvote project');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const downvoteProject = async (projectId, userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/${projectId}/downvote/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to downvote project');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const removeVote = async (projectId, userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/${projectId}/vote/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to remove vote');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update project');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const getUserProjects = async () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`http://127.0.0.1:8000/api/users/me/projects`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch your projects');
  }

  const data = await response.json();
  return data;
};

