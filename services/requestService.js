const BASE_URL = 'http://127.0.0.1:8000/api';

export const getProjectRequests = async (projectId) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/projects/${projectId}/requests`, {
    method: 'GET',
    headers
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Failed to fetch project requests');
  }

  return res.json();
};

export const respondToRequest = async (requestId, status, role = null) => {
  const token = localStorage.getItem('token');

  const body = { status };
  if (role) body.role = role;

  const res = await fetch(`${BASE_URL}/requests/${requestId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || 'Failed to update request');
  }

  return res.json();
};

export const getMyRequests = async () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/users/me/requests`, { method: 'GET', headers });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Failed to fetch your requests');
  }

  return res.json();
};

export const createRequest = async (projectId, message = null, role) => {
  const token = localStorage.getItem('token');

  const body = { role };
  if (message !== null && message !== undefined) body.message = message;

  const res = await fetch(`${BASE_URL}/projects/${projectId}/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.detail || 'Failed to create request');
  }

  return res.json();
};

export default {
  getProjectRequests,
  respondToRequest,
  getMyRequests,
  createRequest,
};
