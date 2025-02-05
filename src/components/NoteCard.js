import React from 'react';
import { FileText, Mic, Copy, Trash2, Edit, Clock } from 'lucide-react';
import '../css/NoteCard.css'

const NoteCard = ({ note, onClick, onCopy, onDelete, onRename }) => {
  const isRecent = new Date(note.date) > new Date(Date.now() - 24 * 60 * 60 * 1000);

  return (
    <div className="note-card" onClick={onClick}>
      <div className="note-card-header">
        <div className="note-type-icon">
          {note.type === 'audio' ? <Mic size={20} /> : <FileText size={20} />}
        </div>
        <div className="note-details">
          <h6 className="note-title">{note.title}</h6>
          <div className="note-meta">
            <span className={`note-tag ${isRecent ? 'recent' : 'old'}`}>
              {isRecent ? 'New' : 'Old'}
            </span>
            <span className="note-date">
              <Clock size={12} /> {note.date}
            </span>
            {note.type === 'audio' && (
              <span className="note-audio-length">
                <Mic size={12} /> {note.audioLength}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="note-card-body">
        <p className="note-content">{note.content}</p>
        <div className="note-actions">
          <button className="btn-action" onClick={(e) => { e.stopPropagation(); onCopy(note.content); }}>
            <Copy size={16} />
          </button>
          <button className="btn-action" onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}>
            <Trash2 size={16} />
          </button>
          <button className="btn-action" onClick={(e) => { e.stopPropagation(); onRename(note.id); }}>
            <Edit size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;