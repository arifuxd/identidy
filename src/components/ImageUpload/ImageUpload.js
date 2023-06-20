"use client";
import { useState, useEffect } from "react";
import {
  storage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "@/utils/firebaseConfig";

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
    avatar: "",
  });
  const [combinedData, setcombinedData] = useState({});

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
      const imageName = `${new Date().getTime()}-${selectedImage.name}`;
      const imageRef = ref(storage, `uploads/${imageName}`);
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
              console.log(downloadURL);

              // Update the combinedData object with the imgUrl
              setcombinedData({
                ...formData,
                avatar: downloadURL,
              });

              // Send the POST request
              postData();
            }
          );
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  async function postData() {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify(combinedData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.ok) {
        // Reset the form and selected image state
        setFormData({
          username: "",
          name: "",
          title: "",
          bio: "",
          phone: "",
          email: "",
        });
        setSelectedImage(null);
      } else {
        // Handle the error response
        console.error("Error uploading data:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  }

  useEffect(() => {
    console.log("imgUrl", imgUrl);
    if (imgUrl) {
      postData();
    }
  }, [imgUrl]);

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
