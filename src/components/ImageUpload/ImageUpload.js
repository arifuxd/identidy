"use client";
// import { useState, useEffect } from "react";
// import {
//   storage,
//   ref,
//   getDownloadURL,
//   uploadBytesResumable,
// } from "@/utils/firebaseConfig";

// function ImageUploadForm() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [progresspercent, setProgresspercent] = useState(0);
//   const [imgUrl, setImgUrl] = useState(null);

//   const [formData, setFormData] = useState({
//     username: "",
//     name: "",
//     title: "",
//     bio: "",
//     phone: "",
//     email: "",
//     avatar: "",
//   });
//   const [combinedData, setcombinedData] = useState({});

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedImage(file);
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       // Upload the image to Firebase Storage
//       const imageName = `${new Date().getTime()}-${selectedImage.name}`;
//       const imageRef = ref(storage, `uploads/${imageName}`);
//       const uploadTask = uploadBytesResumable(imageRef, selectedImage);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress = Math.round(
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//           );
//           setProgresspercent(progress);
//           console.log(`Upload is ${progress}% done`);
//           console.log(uploadTask.snapshot.ref);
//         },
//         (error) => {
//           console.error(error);
//         },
//         () => {
//           getDownloadURL(ref(storage, uploadTask.snapshot.ref.fullPath)).then(
//             (downloadURL) => {
//               setImgUrl(downloadURL);
//               console.log(downloadURL);

//               // Update the combinedData object with the imgUrl
//               setcombinedData({
//                 ...formData,
//                 avatar: downloadURL,
//               });

//               // Send the POST request
//               postData();
//             }
//           );
//         }
//       );
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

//   async function postData() {
//     try {
//       const response = await fetch("/api/user", {
//         method: "POST",
//         body: JSON.stringify(combinedData),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       console.log(response);
//       if (response.ok) {
//         // Reset the form and selected image state
//         setFormData({
//           username: "",
//           name: "",
//           title: "",
//           bio: "",
//           phone: "",
//           email: "",
//         });
//         setSelectedImage(null);
//       } else {
//         // Handle the error response
//         console.error("Error uploading data:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error uploading data:", error);
//     }
//   }

//   useEffect(() => {
//     console.log("imgUrl", imgUrl);
//     if (imgUrl) {
//       postData();
//     }
//   }, [imgUrl]);

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="username">Username</label>
//         <input
//           type="text"
//           id="username"
//           name="username"
//           value={formData.username}
//           onChange={handleInputChange}
//         />
//       </div>
//       <div>
//         <label htmlFor="name">Name</label>
//         <input
//           type="text"
//           id="name"
//           name="name"
//           value={formData.name}
//           onChange={handleInputChange}
//         />
//       </div>
//       {/* Include other form fields as needed */}
//       <div>
//         <input type="file" accept="image/*" onChange={handleImageChange} />
//         {selectedImage && (
//           <img src={URL.createObjectURL(selectedImage)} alt="Selected Image" />
//         )}
//       </div>
//       <button type="submit">Upload</button>
//     </form>
//   );
// }

// export default ImageUploadForm;
import { useState } from "react";
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Upload the selected image to Firebase Storage
    const storageRef = ref(storage, `images/${selectedImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Update the progress percentage
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgresspercent(progress);
      },
      (error) => {
        console.error("Error uploading image:", error);
      },
      async () => {
        // Get the download URL for the uploaded image
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Set the image URL state variable
        setImgUrl(downloadURL);

        // Combine the form data and image URL into a single object
        const combinedData = { ...formData, avatar: downloadURL };

        // Post the combined data to the server
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
    );
  };

  return (
    // <form onSubmit={handleSubmit}>
    //   <label>
    //     Username
    //     <input
    //       type="text"
    //       name="username"
    //       value={formData.username}
    //       onChange={handleInputChange}
    //     />
    //   </label>
    //   <label>
    //     Name
    //     <input
    //       type="text"
    //       name="name"
    //       value={formData.name}
    //       onChange={handleInputChange}
    //     />
    //   </label>
    //   <label>
    //     Title
    //     <input
    //       type="text"
    //       name="title"
    //       value={formData.title}
    //       onChange={handleInputChange}
    //     />
    //   </label>
    //   <label>
    //     Bio
    //     <textarea
    //       name="bio"
    //       value={formData.bio}
    //       onChange={handleInputChange}
    //     />
    //   </label>
    //   <label>
    //     Phone
    //     <input
    //       type="text"
    //       name="phone"
    //       value={formData.phone}
    //       onChange={handleInputChange}
    //     />
    //   </label>
    //   <label>
    //     Email
    //     <input
    //       type="email"
    //       name="email"
    //       value={formData.email}
    //       onChange={handleInputChange}
    //     />
    //   </label>
    //   <label>
    //     Avatar
    //     <input type="file" onChange={handleImageChange} />
    //   </label>
    //   {selectedImage && (
    //     <div>
    //       <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
    //       <progress value={progresspercent} max="100" />
    //     </div>
    //   )}
    //   <button type="submit">Upload</button>
    // </form>

    // <form onSubmit={handleSubmit} className="max-w-md mx-auto">
    //   <div className="mb-4">
    //     <label htmlFor="username" className="text-gray-700">
    //       Username
    //     </label>
    //     <input
    //       type="text"
    //       id="username"
    //       name="username"
    //       value={formData.username}
    //       onChange={handleInputChange}
    //       className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    //     />
    //   </div>
    //   <div className="mb-4">
    //     <label htmlFor="name" className="text-gray-700">
    //       Name
    //     </label>
    //     <input
    //       type="text"
    //       id="name"
    //       name="name"
    //       value={formData.name}
    //       onChange={handleInputChange}
    //       className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    //     />
    //   </div>
    //   <div className="mb-4">
    //     <label htmlFor="title" className="text-gray-700">
    //       Title
    //     </label>
    //     <input
    //       type="text"
    //       id="title"
    //       name="title"
    //       value={formData.title}
    //       onChange={handleInputChange}
    //       className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    //     />
    //   </div>
    //   <div className="mb-4">
    //     <label htmlFor="bio" className="text-gray-700">
    //       Bio
    //     </label>
    //     <textarea
    //       id="bio"
    //       name="bio"
    //       value={formData.bio}
    //       onChange={handleInputChange}
    //       className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    //     ></textarea>
    //   </div>
    //   <div className="mb-4">
    //     <label htmlFor="phone" className="text-gray-700">
    //       Phone
    //     </label>
    //     <input
    //       type="text"
    //       id="phone"
    //       name="phone"
    //       value={formData.phone}
    //       onChange={handleInputChange}
    //       className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    //     />
    //   </div>
    //   <div className="mb-4">
    //     <label htmlFor="email" className="text-gray-700">
    //       Email
    //     </label>
    //     <input
    //       type="email"
    //       id="email"
    //       name="email"
    //       value={formData.email}
    //       onChange={handleInputChange}
    //       className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    //     />
    //   </div>
    //   <div className="mb-4">
    //     <label htmlFor="avatar" className="text-gray-700">
    //       Avatar
    //     </label>
    //     <input
    //       type="file"
    //       id="avatar"
    //       onChange={handleImageChange}
    //       className="mt-1"
    //     />
    //   </div>
    //   {selectedImage && (
    //     <div className="mb-4">
    //       <img
    //         src={URL.createObjectURL(selectedImage)}
    //         alt="Selected"
    //         className="w-20 h-20 rounded-full"
    //       />
    //       <progress
    //         value={progresspercent}
    //         max="100"
    //         className="w-full mt-2"
    //       ></progress>
    //     </div>
    //   )}
    //   <button
    //     type="submit"
    //     className="px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-rose-600"
    //   >
    //     Upload
    //   </button>
    // </form>
    <div className="isolate bg-dark px-6 py-10  ">
      {/* <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div> */}
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          Create your account
        </h2>
        <p className="mt-2 text-lg leading-8 text-slate-300">
          Enter your details to create your account.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold leading-6 text-slate-50"
            >
              Username
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="enter your username"
                value={formData.username}
                onChange={handleInputChange}
                autoComplete="username"
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6 autofill:bg-zinc-950"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold leading-6 text-slate-50"
            >
              Name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-semibold leading-6 text-slate-50"
            >
              Title
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="bio"
              className="block text-sm font-semibold leading-6 text-slate-50"
            >
              Bio
            </label>
            <div className="mt-2.5">
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold leading-6 text-slate-50"
            >
              Phone
            </label>
            <div className="mt-2.5">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                autoComplete="tel"
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold leading-6 text-slate-50"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="avatar"
              className="block text-sm font-semibold leading-6 text-slate-50"
            >
              Avatar
            </label>
            <div className="mt-2.5">
              <input
                type="file"
                name="avatar"
                id="avatar"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full rounded-md border-0 px-3.5 py-3.5 text-slate-50 shadow-sm ring-1 ring-inset placeholder:text-gray-400  ring-zinc-700 sm:text-sm sm:leading-6 bg-zinc-950 hover:file:cursor-pointer file:bg-rose-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-rose-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ImageUploadForm;
