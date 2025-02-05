import React, { useState, useRef } from 'react';
import { Mic, MicOff, Send, Type, FileText } from 'lucide-react';
import '../css/InputBar.css'

const InputBar = ({ onAddNote }) => {
  const [inputType, setInputType] = useState('text');
  const [noteContent, setNoteContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const startAudioRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        setNoteContent('');
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setNoteContent(transcript);
      };

      recognitionRef.current.start();
    } else {
      alert('Speech recognition not supported');
    }
  };

  const stopAudioRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if (noteContent.trim()) {
      onAddNote({
        title: noteContent.length > 20
          ? noteContent.substring(0, 20) + '...'
          : noteContent,
        type: inputType,
        content: noteContent,
        audioLength: inputType === 'audio' ? '00:09' : null
      });
      setNoteContent('');
    }
  };

  return (
    <div className="input-group p-3 bg-white shadow-sm">
      <div className="input-group-prepend">
        <button 
          className={`btn ${inputType === 'text' ? 'btn-primary' : 'btn-outline-secondary'} mr-2`}
          onClick={() => setInputType('text')}
          style={{marginRight:"10px"}}
        >
          <Type />
        </button>
        <button 
          className={`btn ${inputType === 'audio' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setInputType('audio')}
        >
          <FileText />
        </button>
      </div>
      
      {inputType === 'text' ? (
        <input
          type="text"
          className="form-control mx-2"
          placeholder="Write a note"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
        />
      ) : (
        <div className="d-flex align-items-center mx-2 flex-grow-1">
          {isRecording ? (
            <button 
              className="btn btn-danger mr-2"
              onClick={stopAudioRecognition}
            >
              <MicOff />
              Stop Recording
            </button>
          ) : (
            <button 
              className="btn btn-success mr-2"
              onClick={startAudioRecognition}
            >
              <Mic />
              Start Recording
            </button>
          )}
          {noteContent && <span className="ml-2">{noteContent}</span>}
        </div>
      )}
      
      <div className="input-group-append">
        <button 
          className="btn btn-primary"
          onClick={handleSend}
        >
          <Send />
        </button>
      </div>
    </div>
  );
};

export default InputBar;