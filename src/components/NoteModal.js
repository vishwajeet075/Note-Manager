import React, { useState } from 'react';
import { Fullscreen, Minimize2, Star, Image, Edit, Download, X } from 'lucide-react';
import '../css/NoteModal.css';

const NoteModal = ({ note, onClose, onFavorite, onEdit, onImageUpload }) => {
  const [activeTab, setActiveTab] = useState('Notes');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(note.isFavorite); // Added local state

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSave = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev); // Toggle state
    onFavorite(); // Call parent function
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'Transcript':
        return (
          <div className="transcript-content">
            {note.transcript || "No transcript available"}
          </div>
        );
      case 'Create':
        return (
          <div className="create-content">
            <textarea 
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Edit your note..."
            />
            <button onClick={handleSave}>Save</button>
          </div>
        );
      default:
        return (
          <div className="notes-content">
            {note.content}
          </div>
        );
    }
  };

  return (
    <div className={`note-modal ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="modal-header">
        <h2>{note.title}</h2>
        <div className="modal-actions">
          <button onClick={handleFavorite}>
            <Star fill={isFavorite ? 'gold' : 'none'} stroke="black" />
          </button>
          <button onClick={handleFullscreen}>
            {isFullscreen ? <Minimize2 /> : <Fullscreen />}
          </button>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
      </div>
      <div className="modal-tabs">
        <button 
          className={activeTab === 'Notes' ? 'active' : ''}
          onClick={() => setActiveTab('Notes')}
        >
          Notes
        </button>
        <button 
          className={activeTab === 'Transcript' ? 'active' : ''}
          onClick={() => setActiveTab('Transcript')}
        >
          Transcript
        </button>
        <button 
          className={activeTab === 'Create' ? 'active' : ''}
          onClick={() => setActiveTab('Create')}
        >
          Edit
        </button>
      </div>
      <div className="modal-content">
        {renderContent()}
        {note.type === 'audio' && (
          <div className="audio-actions">
            <button onClick={() => window.open(note.audioUrl, '_blank')}>
              <Download /> Download Audio
            </button>
          </div>
        )}
        <div className="image-upload">
          <input 
            type="file" 
            id="image-upload" 
            accept="image/*" 
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload">
            <Image /> Upload Image
          </label>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
