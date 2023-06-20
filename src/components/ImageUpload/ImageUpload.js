"use client";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyDeVoYzoST-SgA0BiWaxYMkHCPpuUYGKu8",
  authDomain: "identidy-nfc.firebaseapp.com",
  projectId: "identidy-nfc",
  storageBucket: "identidy-nfc.appspot.com",
  messagingSenderId: "403470328257",
  appId: "1:403470328257:web:ea0addd969555e67114f40",
  measurementId: "G-FJPVE95MDH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

const storageRef = ref(storage);

function ImageUploadForm() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [imgUrl, setImgUrl] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    title: "",
    bio: "",
    phone: "",
    email: "",
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
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

    try {
      // Upload the image to Firebase Storage

      // const storageRef = storage.storage.ref();
      const imageRef = ref(storage, `uploads/${selectedImage.name}`);

      const uploadTask = uploadBytesResumable(imageRef, selectedImage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgresspercent(progress);
          console.log(`Upload is ${progress}% done`);
          console.log(uploadTask.snapshot.ref);
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(ref(storage, uploadTask.snapshot.ref.fullPath)).then(
            (downloadURL) => {
              setImgUrl(downloadURL);
            }
          );
        }
      );
      console.log(imgUrl);

      const combinedData = {
        ...formData,
        avatar: imageRef.fullPath,
      };

      console.log(combinedData);
    } catch (error) {
      // Perform the API request to send the combined data to the backend
      // const response = await fetch("/api/your-post-api-endpoint", {
      //   method: "POST",
      //   body: JSON.stringify(combinedData),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      // if (response.ok) {
      //   // Reset the form and selected image state
      //   setFormData({
      //     username: "",
      //     name: "",
      //     title: "",
      //     bio: "",
      //     phone: "",
      //     email: "",
      //   });
      //   setSelectedImage(null);
      // }
      //  else {
      //   // Handle the error response
      //   console.error("Error uploading data:", response.statusText);
      // }
      console.error("Error uploading image:", error);
    }
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
        {selectedImage && (
          <img src={URL.createObjectURL(selectedImage)} alt="Selected Image" />
        )}
      </div>
      <button type="submit">Upload</button>
    </form>
  );
}

export default ImageUploadForm;
