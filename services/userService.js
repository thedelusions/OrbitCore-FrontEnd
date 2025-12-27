const BASE_URL = 'http://127.0.0.1:8000/api';

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching user:', err);
    throw err;
  }
};

