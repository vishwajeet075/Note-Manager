import React, { useState, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import SearchSort from './components/SearchSort';
import InputBar from './components/InputBar';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';
import { fetchNotes, addNote as addNoteApi, deleteNote as deleteNoteApi, updateNoteTitle, toggleNoteFavorite } from './utils/api';
import { useEffect } from 'react';
// Add these to your existing imports from './utils/api'
import { 
  updateNoteContent,  // Add this
  uploadNoteImage     // Add this
} from './utils/api';






// Main Dashboard Component
// Main Dashboard Component
function Dashboard({ isFavouritesRoute = false }) {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMethod, setSortMethod] = useState('newest');
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const fetchedNotes = await fetchNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };
    loadNotes();
  }, []);

  const filteredAndSortedNotes = useMemo(() => {
    let result = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isFavouritesRoute) {
      result = result.filter((note) => note.isFavorite);
    }

    switch (sortMethod) {
      case 'oldest':
        return result.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'title':
        return result.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }, [notes, searchTerm, sortMethod, isFavouritesRoute]);

  const addNote = useCallback(async (newNote) => {
    try {
      const noteToAdd = {
        ...newNote,
        date: new Date().toISOString().split('T')[0],
        isFavorite: false,
      };
      const addedNote = await addNoteApi(noteToAdd);
      setNotes(prevNotes => [...prevNotes, addedNote]);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  }, []);

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  const handleDelete = async (id) => {
    console.log('Attempting to delete note with ID:', id); // Debug log
    if (!id) {
      console.error('No note ID provided for deletion');
      return;
    }
    try {
      await deleteNoteApi(id);
      setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleRename = async (id) => {
    console.log('Attempting to rename note with ID:', id); // Debug log
    if (!id) {
      console.error('No note ID provided for renaming');
      return;
    }
    const newTitle = prompt('Enter new title:');
    if (newTitle) {
      try {
        const updatedNote = await updateNoteTitle(id, newTitle);
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note._id === id ? { ...note, title: newTitle } : note
          )
        );
      } catch (error) {
        console.error('Error renaming note:', error);
      }
    }
  };

  const handleFavorite = async (id) => {
    console.log('Attempting to toggle favorite for note ID:', id); // Debug log
    if (!id) {
      console.error('No note ID provided for favorite toggle');
      return;
    }
    try {
      const updatedNote = await toggleNoteFavorite(id);
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note._id === id ? { ...note, isFavorite: !note.isFavorite } : note
        )
      );
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  // Add these after handleFavorite in your Dashboard component

const handleNoteUpdate = async (noteId, updatedContent) => {
  console.log('Attempting to update content for note ID:', noteId); // Debug log
  if (!noteId) {
    console.error('No note ID provided for content update');
    return;
  }
  try {
    const updatedNote = await updateNoteContent(noteId, updatedContent);
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note._id === noteId ? { ...note, content: updatedContent } : note
      )
    );
    return updatedNote;
  } catch (error) {
    console.error('Error updating note content:', error);
    throw error;
  }
};

const handleImageUpload = async (noteId, imageFile) => {
  console.log('Attempting to upload image for note ID:', noteId); // Debug log
  if (!noteId) {
    console.error('No note ID provided for image upload');
    return;
  }
  try {
    const uploadedImage = await uploadNoteImage(noteId, imageFile);
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note._id === noteId 
          ? { 
              ...note, 
              images: [...(note.images || []), uploadedImage] 
            } 
          : note
      )
    );
    return uploadedImage;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <SearchSort onSearch={setSearchTerm} onSort={setSortMethod} />
        <div className="notes-staging-area">
          {filteredAndSortedNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onClick={() => setSelectedNote(note)}
              onCopy={handleCopy}
              onDelete={()=>handleDelete(note._id)}
              onRename={()=>handleRename(note._id)}
            />
          ))}
        </div>
        {!isFavouritesRoute && <InputBar onAddNote={addNote} />}
      </div>

{selectedNote && (
  <NoteModal
    note={selectedNote}
    onClose={() => setSelectedNote(null)}
    onFavorite={() => handleFavorite(selectedNote._id)}
    onUpdateContent={handleNoteUpdate}
    onImageUpload={handleImageUpload}
  />
)}
    </div>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check if user is authenticated
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Main App Component with Routing
// Main App Component with Routing
function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to Signup */}
        <Route path="/" element={<Navigate to="/signup" />} />

        {/* Signup Route */}
        <Route path="/signup" element={<Signup />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Route (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Favourites Route (Protected) */}
        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <Dashboard isFavouritesRoute={true} />
            </ProtectedRoute>
          }
        />

        {/* Questions Route (Protected) */}
        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
}
export default App;