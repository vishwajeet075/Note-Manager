import React, { useState, useEffect } from 'react';
import { 
  Maximize2, Minimize2, Star, Image, Edit2,
  X, Play, Pause, Save, Volume2
} from 'lucide-react';
import '../css/NoteModal.css';

const NoteModal = ({ note, onClose, onFavorite, onUpdateContent, onImageUpload }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [images, setImages] = useState(note.images || []);
  const [isFavorite, setIsFavorite] = useState(note.isFavorite);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEditedContent(note.content);
    setIsFavorite(note.isFavorite);
    setImages(note.images || []);
  }, [note]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleSaveContent = async () => {
    try {
      setIsLoading(true);
      await onUpdateContent(note._id, editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        const uploadedImage = await onImageUpload(note._id, file);
        setImages(prevImages => [...prevImages, uploadedImage]);
      } catch (error) {
        console.error('Failed to upload image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    } else {
      const utterance = new SpeechSynthesisUtterance(note.content);
      window.speechSynthesis.speak(utterance);
    }
    setIsSpeaking(!isSpeaking);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavorite(note._id);
  };

  return (
    <div className="note-modal-overlay">
      <div className={`note-modal ${isFullscreen ? 'fullscreen' : ''}`}>
        <div className="note-modal-header">
          <div className="note-modal-title">
            <h2>{note.title}</h2>
            {note.type === 'audio' && (
              <span className="note-type-badge">
                <Volume2 size={16} /> Audio Note
              </span>
            )}
          </div>
          
          <div className="note-modal-actions">
            <button 
              className={`action-btn favorite ${isFavorite ? 'active' : ''}`}
              onClick={handleFavorite}
              disabled={isLoading}
            >
              <Star />
            </button>
            
            {note.type === 'audio' && (
              <button 
                className={`action-btn ${isSpeaking ? 'active' : ''}`}
                onClick={toggleSpeech}
                disabled={isLoading}
              >
                {isSpeaking ? <Pause /> : <Play />}
              </button>
            )}
            
            <button 
              className="action-btn"
              onClick={() => setIsEditing(!isEditing)}
              disabled={isLoading}
            >
              <Edit2 />
            </button>
            
            <button 
              className="action-btn"
              onClick={toggleFullscreen}
              disabled={isLoading}
            >
              {isFullscreen ? <Minimize2 /> : <Maximize2 />}
            </button>
            
            <button 
              className="action-btn close"
              onClick={onClose}
              disabled={isLoading}
            >
              <X />
            </button>
          </div>
        </div>

        <div className="note-modal-content">
          {isEditing ? (
            <div className="edit-container">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="edit-textarea"
                placeholder="Enter note content..."
                disabled={isLoading}
              />
              <button 
                className="save-btn"
                onClick={handleSaveContent}
                disabled={isLoading}
              >
                <Save size={16} /> {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div className="content-container">
              <div className="note-text">
                {note.content}
              </div>
              
              {images.length > 0 && (
                <div className="images-grid">
                  {images.map((image, index) => (
                    // eslint-disable-next-line
                    <img 
                      key={index}
                      src={image.url}
                      alt={`Note image ${index + 1}`}
                      className="note-image"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="note-modal-footer">
          <div className="upload-container">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isLoading}
            />
            <label 
              htmlFor="image-upload" 
              className={`upload-btn ${isLoading ? 'disabled' : ''}`}
            >
              <Image size={16} /> {isLoading ? 'Uploading...' : 'Add Image'}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;