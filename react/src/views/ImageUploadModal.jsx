import React, { useState } from 'react';
import './css/ImageUploadModal.css';
import { useDropzone } from "react-dropzone";

const ImageUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [inputField1, setInputField1] = useState('');
  const [inputField2, setInputField2] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: true,
    onDrop: (acceptedFiles) => {
      setUploadedImages((prevImages) => [
        ...prevImages,
        ...acceptedFiles,
      ]);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    // Log the uploaded images and input fields before passing them
    console.log('Uploaded Images:', uploadedImages);
    console.log('Input Field 1:', inputField1);
    console.log('Input Field 2:', inputField2);

    // Pass the actual uploaded images and input fields
    onSubmit({ images: uploadedImages, inputField1, inputField2 });
    onClose(); // Close the modal after submission
  };

  if (!isOpen) {
    console.log('Modal is not open'); // Log if modal is not open
    return null;
  }

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Upload Image</h2>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {uploadedImages.length > 0 ? (
            <div>
              {uploadedImages.map((file, index) => (
                <p key={index}>{file.name}</p>
              ))}
            </div>
          ) : (
            <p>Drag & drop images here, or click to select</p>
          )}
        </div>
        {uploadedImages.length > 0 && (
          <div className="imagePreview">
            <h4>Uploaded Images:</h4>
            {uploadedImages.map((file, index) => (
              <img key={index} src={URL.createObjectURL(file)} alt="Uploaded" className="image" />
            ))}
          </div>
        )}
        <input
          type="text"
          placeholder="Input Field 1"
          value={inputField1}
          onChange={(e) => setInputField1(e.target.value)}
        />
        <input
          type="text"
          placeholder="Input Field 2"
          value={inputField2}
          onChange={(e) => setInputField2(e.target.value)}
          required
        />
        <button type="button" onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ImageUploadModal;
