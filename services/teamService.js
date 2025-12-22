const BASE_URL = 'http://127.0.0.1:8000/api';

export const getTeamMembers = async (projectId) => {
  try {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/projects/${projectId}/team`, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch team members');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching team members:', err);
    throw err;
  }
};

export const removeTeamMember = async (projectId, userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/projects/${projectId}/team/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to remove team member');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error removing team member:', err);
    throw err;
  }
};

export const getTeamComments = async (projectId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/projects/${projectId}/team/comments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch team comments');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching team comments:', err);
    throw err;
  }
};

export const addTeamComment = async (projectId, commentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/projects/${projectId}/team/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(commentData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to add team comment');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error adding team comment:', err);
    throw err;
  }
};

export const getProjectTeam = async (projectId) => {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `http://127.0.0.1:8000/api/projects/${projectId}/team`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch project team');
    }

    return await response.json();
  } catch (err) {
    console.error('Error fetching project team:', err.message);
    throw err;
  }
};