import React, { useState, useRef } from 'react';
import { AlertCircle, Upload, Image as ImageIcon, FileText } from 'lucide-react';
import '../css/StudySection.css';

const StudySection = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFiles = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload an image file');
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("https://note-manager-backend-iuif.onrender.com/study/upload", {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      
      if (contentType.includes("image")) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setResultImage(imageUrl);
        setExtractedText(null);
      } else {
        const text = await response.text();
        setExtractedText(text);
        setResultImage(null);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Study Smart</h2>
              
              <div className="alert alert-info d-flex align-items-center" role="alert">
                <AlertCircle className="me-2" size={20} />
                <div>
                  Upload your handwritten notes or concept diagrams to generate visual mind maps or extract text!
                </div>
              </div>

              <form onSubmit={handleImageUpload} className="mt-4">
                <div 
                  className={`upload-area ${dragActive ? 'drag-active' : ''} ${preview ? 'has-preview' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden-input"
                    accept="image/*"
                    onChange={(e) => handleFiles(e.target.files[0])}
                  />
                  
                  {!preview ? (
                    <div className="upload-prompt">
                      <Upload size={48} className="mb-3" />
                      <p className="mb-2">Drag and drop your image here</p>
                      <p className="text-muted">or</p>
                      <button 
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Browse Files
                      </button>
                    </div>
                  ) : (
                    <div className="preview-container">
                      <img src={preview} alt="Preview" className="img-preview" />
                      <button 
                        type="button" 
                        className="btn btn-sm btn-danger remove-btn"
                        onClick={() => {
                          setImage(null);
                          setPreview(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-center mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={loading || !image}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      'Generate Visualization'
                    )}
                  </button>
                </div>
              </form>

              {(resultImage || extractedText) && (
                <div className="result-section mt-5">
                  <h3 className="text-center mb-4">
                    {resultImage ? (
                      <><ImageIcon className="me-2" size={24} /> Generated Visualization</>
                    ) : (
                      <><FileText className="me-2" size={24} /> Extracted Text</>
                    )}
                  </h3>
                  
                  {resultImage && (
                    <div className="text-center">
                      <img 
                        src={resultImage} 
                        alt="Visualization" 
                        className="result-image img-fluid rounded shadow"
                      />
                    </div>
                  )}
                  
                  {extractedText && (
                    <div className="extracted-text p-4 bg-light rounded">
                      {extractedText}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySection;