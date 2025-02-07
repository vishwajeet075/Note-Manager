import React, { useState, useRef } from 'react';
import { Mic, MicOff, Send, Type, FileText } from 'lucide-react';
import '../css/InputBar.css';

const InputBar = ({ onAddNote }) => {
  const [inputType, setInputType] = useState('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
        setContent('');
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setContent(transcript);
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
    if (title.trim() && content.trim()) {
      onAddNote({
        title: title.trim(),
        type: inputType,
        content: content.trim(),
        audioLength: inputType === 'audio' ? '00:09' : null
      });
      setTitle('');
      setContent('');
    } else {
      alert('Please enter both title and content for the note');
    }
  };

  return (
    <div className="input-group p-3 bg-white shadow-sm">
      <div className="d-flex flex-column w-100">
        {/* Type Selection Buttons */}
        <div className="input-group-prepend mb-2">
          <button
            className={`btn ${inputType === 'text' ? 'btn-primary' : 'btn-outline-secondary'} mr-2`}
            onClick={() => setInputType('text')}
            style={{marginRight: "10px"}}
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

        {/* Title Input */}
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content Input */}
        {inputType === 'text' ? (
          <div className="d-flex">
            <input
              type="text"
              className="form-control"
              placeholder="Write note content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              className="btn btn-primary ml-2"
              onClick={handleSend}
              style={{marginLeft: "10px"}}
            >
              <Send />
            </button>
          </div>
        ) : (
          <div className="d-flex align-items-center w-100">
            <div className="d-flex align-items-center flex-grow-1">
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
              <div className="flex-grow-1 mx-2">
                {content && <span>{content}</span>}
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleSend}
            >
              <Send />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputBar;