// utils/api.js
const API_BASE_URL = 'http://localhost:5000'; // Replace with your backend URL

export const createNote = async (note, token) => {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(note),
  });
  return response.json();
};

export const deleteNote = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
};

export const renameNote = async (id, newTitle, token) => {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title: newTitle }),
  });
  return response.json();
};