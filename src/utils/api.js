const API_BASE_URL = 'http://localhost:5000'; // Adjust this to your backend URL

// Helper function to get JWT token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Fetch all notes for the authenticated user
export const fetchNotes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'GET',
      headers: getAuthHeader()
    });
    
    if (!response.ok) throw new Error('Failed to fetch notes');
    return await response.json();
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

// Add a new note
export const addNote = async (noteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(noteData)
    });
    
    if (!response.ok) throw new Error('Failed to add note');
    return await response.json();
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (noteId) => {
  if (!noteId) {
    throw new Error('Note ID is required');
  }
  console.log('Deleting note with ID:', noteId); // Debug log

  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    
    if (!response.ok) throw new Error('Failed to delete note');
    return await response.json();
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// Update note title
export const updateNoteTitle = async (noteId, newTitle) => {
  if (!noteId) {
    throw new Error('Note ID is required');
  }
  console.log('Updating note with ID:', noteId); // Debug log

  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ title: newTitle })
    });
    
    if (!response.ok) throw new Error('Failed to update note title');
    return await response.json();
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

// Toggle favorite status
export const toggleNoteFavorite = async (noteId) => {
  if (!noteId) {
    throw new Error('Note ID is required');
  }
  console.log('Toggling favorite for note ID:', noteId); // Debug log

  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}/favorite`, {
      method: 'PATCH',
      headers: getAuthHeader()
    });
    
    if (!response.ok) throw new Error('Failed to update favorite status');
    return await response.json();
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    throw error;
  }
};




// Update note content
export const updateNoteContent = async (noteId, newContent) => {
  if (!noteId) {
    throw new Error('Note ID is required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}/content`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ content: newContent })
    });
    
    if (!response.ok) throw new Error('Failed to update note content');
    return await response.json();
  } catch (error) {
    console.error('Error updating note content:', error);
    throw error;
  }
};

// Upload image for note
export const uploadNoteImage = async (noteId, imageFile) => {
  if (!noteId || !imageFile) {
    throw new Error('Note ID and image file are required');
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        // Note: Don't set Content-Type here, it's automatically set for FormData
      },
      body: formData
    });
    
    if (!response.ok) throw new Error('Failed to upload image');
    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};