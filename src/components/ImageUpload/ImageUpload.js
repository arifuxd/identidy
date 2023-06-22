"use client";
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
  const [additionalFields, setAdditionalFields] = useState([]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleAdd = () => {
    setAdditionalFields([...additionalFields, additionalFields.length + 1]);
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
        <h2 className="text-3xl font-bold  text-slate-50 sm:text-4xl">
          Create your account
        </h2>
        <p className="mt-2 text-md leading-8 text-zinc-300">
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
              <span className="font-normal text-red-600 pl-1 text-md">*</span>
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="enter your username"
                value={formData.username}
                required
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
              <span className="font-normal text-red-600 pl-1 text-md">*</span>
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
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
              <span className="font-normal text-red-600 pl-1 text-md">*</span>
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                required
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
              <span className="font-normal text-red-600 pl-1 text-md">*</span>
            </label>
            <div className="mt-2.5">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
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
              <span className="font-normal text-red-600 pl-1 text-md">*</span>
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-2 block w-full text-xl  font-semibold leading-6 text-slate-50 border-bottom">
            Social Links
          </div>
          <div>
            <label
              htmlFor="facebook"
              className="block text-sm font-semibold leading-6 text-slate-50"
            >
              Facebook
              <span className="text-xs font-normal text-zinc-500 pl-1">
                (Optional)
              </span>
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6 autofill:bg-zinc-950"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="instagram"
              className="block text-sm font-semibold leading-6 text-slate-50"
            >
              Instagram
              <span className="text-xs font-normal text-zinc-500 pl-1">
                (Optional)
              </span>
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="linkedin"
              className="block text-sm font-semibold leading-6 text-slate-50"
            >
              Linkedin
              <span className="text-xs font-normal text-zinc-500 pl-1">
                (Optional)
              </span>
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6 autofill:bg-zinc-950"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="twitter"
              className="block text-sm font-semibold leading-6 text-slate-50"
            >
              Twitter
              <span className="text-xs font-normal text-zinc-500 pl-1">
                (Optional)
              </span>
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            class="sm:col-span-2 w-full bg-transparent ring-1 ring-rose-600  transition-all  hover:bg-rose-600 text-slate-50 font-semibold py-2 px-4 rounded flex items-center justify-center sm:text-sm sm:leading-6"
          >
            <svg
              class="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span>Add Link</span>
          </button>
          <div className="sm:col-span-2">
            {additionalFields.map((i) => (
              <input
                key={i}
                type="text"
                name={`links-${i}`}
                id={`links-${i}`}
                value={formData[`links-${i}`]}
                placeholder="your link"
                onChange={handleInputChange}
                required
                className="mt-5 block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-600 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            ))}
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
                className="block w-full rounded-md border-0 px-3.5 py-3.5 text-slate-50 shadow-sm ring-1 ring-inset placeholder:text-gray-400  ring-zinc-700 sm:text-sm sm:leading-6 bg-zinc-950 hover:file:cursor-pointer focus:ring-1 focus:ring-inset focus:ring-rose-600 file:bg-rose-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-md"
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
