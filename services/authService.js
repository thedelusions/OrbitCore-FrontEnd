const BASE_URL = 'http://127.0.0.1:8000/api';

export const signUp = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        bio: formData.bio,
        github_profile: formData.github_profile
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    
    // Store token
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    } else if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  } catch (err) {
    throw err;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }

    const response = await fetch(`${BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const userData = await response.json();
    return userData;
  } catch (err) {
    console.error('Error fetching current user:', err);
    return null;
  }
};

export const signOut = () => {
  localStorage.removeItem('token');
};