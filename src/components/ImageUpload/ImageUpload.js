"use client";

import { useState, useEffect } from "react";

function ImageUploadForm() {
  const [selectedImage, setSelectedImage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    title: "",
    bio: "",
    phone: "",
    email: "",
    links: [],
    sociallinks: [],
  });
  function convertImageToBase64(imageFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg"); // You can specify the desired image format here
          resolve(dataUrl);
          console.log(dataUrl);
        };
        img.onerror = (error) => {
          reject(error);
        };
        img.src = reader.result;
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(imageFile);
    });
  }
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const dataUrl = await convertImageToBase64(file);
    setSelectedImage(dataUrl);
    console.log(dataUrl);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Combine the form data and the selected image for submission
    const combinedData = {
      ...formData,
      avatar: selectedImage,
    };
    // Perform the API request to upload the data and image to the server

    // Reset the form and selected image state
    setFormData({
      username: "",
      name: "",
      title: "",
      bio: "",
      phone: "",
      email: "",
    });
    setSelectedImage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>
      {/* Include other form fields as needed */}
      <div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {selectedImage && <img src={selectedImage} alt="Selected Image" />}
      </div>
      <button type="submit">Upload</button>
    </form>
  );
}

export default ImageUploadForm;
