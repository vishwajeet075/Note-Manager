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
import { createNote, deleteNote, renameNote } from './utils/api.js';

// Main Dashboard Component
// Main Dashboard Component
function Dashboard({ isFavouritesRoute = false }) {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMethod, setSortMethod] = useState('newest');
  const [selectedNote, setSelectedNote] = useState(null);

  const token = localStorage.getItem('token'); // Get the token from local storage

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
    const noteToAdd = {
      ...newNote,
      id: notes.length + 1,
      date: new Date().toISOString().split('T')[0],
      audioLength: newNote.type === 'audio' ? '00:09' : null,
      isFavorite: false, // Default to false
    };

    try {
      const createdNote = await createNote(noteToAdd, token);
      setNotes((prevNotes) => [...prevNotes, createdNote]);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  }, [notes, token]);

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteNote(id, token);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }, [token]);

  const handleRename = useCallback(async (id) => {
    const newTitle = prompt('Enter new title:');
    if (newTitle) {
      try {
        await renameNote(id, newTitle, token);
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === id ? { ...note, title: newTitle } : note
          )
        );
      } catch (error) {
        console.error('Failed to rename note:', error);
      }
    }
  }, [token]);

  const handleFavorite = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
      )
    );
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <SearchSort onSearch={setSearchTerm} onSort={setSortMethod} />
        <div className="notes-staging-area">
          {filteredAndSortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => setSelectedNote(note)}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onRename={handleRename}
            />
          ))}
        </div>
        {!isFavouritesRoute && <InputBar onAddNote={addNote} />}
      </div>
      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onFavorite={() => handleFavorite(selectedNote.id)}
        />
      )}
    </div>
  );
}

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check if token exists
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