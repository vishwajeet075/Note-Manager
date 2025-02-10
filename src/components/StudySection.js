// StudySection.js
import React, { useState } from 'react';
import axios from 'axios';
import '../css/StudySection.css';



const StudySection = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(""); // Ensure it's a string

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("https://note-manager-backend-iuif.onrender.com/study/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Extract text from response object properly
      if (response.data && typeof response.data === "object") {
        setResult(response.data.extractedText || "No text extracted."); 
      } else {
        setResult("Invalid response format from server.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="study-section">
      <h2>Study Section</h2>
      <p>Upload handwritten notes to generate a mindmap or extract text.</p>

      <form onSubmit={handleImageUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload and Generate"}
        </button>
      </form>

      {result && (
        <div className="result-container">
          <h3>Extracted Text</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default StudySection;