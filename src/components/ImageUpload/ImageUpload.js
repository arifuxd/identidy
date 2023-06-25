"use client";
import { useState } from "react";
import {
  storage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "@/utils/firebaseConfig";
import Image from "next/image";

function ImageUploadForm() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [imgUrl, setImgUrl] = useState(null);

  //dynamics link code
  const [links, setLinks] = useState([{ id: 1, url: "", title: "Portfolio" }]);
  const addLink = () => {
    const newId = links.length + 1;
    const newLink = { id: newId, url: "", title: "Portfolio" };
    setLinks([...links, newLink]);
  };

  const removeLink = (id) => {
    const updatedLinks = links.filter((link) => link.id !== id);
    setLinks(updatedLinks);
  };

  const handleUrlChange = (id, event) => {
    const updatedLinks = links.map((link) => {
      if (link.id === id) {
        return { ...link, url: event.target.value };
      }
      return link;
    });
    setLinks(updatedLinks);
  };

  const handleOptionChange = (id, event) => {
    const updatedLinks = links.map((link) => {
      if (link.id === id) {
        return { ...link, title: event.target.value };
      }
      return link;
    });
    setLinks(updatedLinks);
  };
  //dynamic links code

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    title: "",
    bio: "",
    phone: "",
    email: "",
    avatar: "",
    links: [],
    sociallinks: [],
  });
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");

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
        const combinedData = {
          ...formData,
          avatar: downloadURL,

          sociallinks: [
            {
              icon: "facebook",
              title: "Facebook",
              url: facebook,
            },
            {
              icon: "instagram",
              title: "Instagram",
              url: instagram,
            },
            {
              icon: "linkedin",
              title: "Linkedin",
              url: linkedin,
            },
            {
              icon: "twitter",
              title: "Twitter",
              url: twitter,
            },
            {
              icon: "youtube",
              title: "Youtube",
              url: youtube,
            },
          ],
          links: links,
        };

        // Post the combined data to the server
        try {
          const response = await fetch("/api/user", {
            method: "POST",
            body: JSON.stringify(combinedData),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            // Reset the form and selected image state
            setFormData({
              username: "",
              name: "",
              title: "",
              bio: "",
              phone: "",
              email: "",
              avatar: "",
              links: [],
              sociallinks: [],
            });
            setSelectedImage(null);

            // Redirect to subdomain profile
            window.location.href = `/${formData.username}`;
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
      <div className="mx-auto max-w-2xl text-center">
        <Image
          className="mx-auto mb-10"
          src="/logo.svg"
          width={130}
          height={100}
        />
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
                placeholder="e.g. johnsmith"
                value={formData.username}
                required
                onChange={handleInputChange}
                autoComplete="username"
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-700 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6 autofill:bg-zinc-950"
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
                placeholder="e.g. John Smith"
                value={formData.name}
                onChange={handleInputChange}
                required
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-700 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
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
                placeholder="e.g. A passionate creative frontend developer"
                required
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-700 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
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
                placeholder="e.g. I am a seasoned and proactive professional who thrives on leveraging technology to drive innovation........"
                onChange={handleInputChange}
                rows={3}
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-700 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
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
                placeholder="e.g. 0123456789"
                onChange={handleInputChange}
                required
                autoComplete="tel"
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-700 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
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
                placeholder="johnsmith@gmail.com"
                onChange={handleInputChange}
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-700 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
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
                value={facebook}
                placeholder="facebook.com/johnsmith"
                onChange={(event) => setFacebook(event.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-700 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6 autofill:bg-zinc-950"
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
                placeholder="instagram.com/johnsmith"
                value={instagram}
                onChange={(event) => setInstagram(event.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-700 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
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
                placeholder="linkedin.com/in/johnsmith"
                value={linkedin}
                onChange={(event) => setLinkedin(event.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-700 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6 autofill:bg-zinc-950"
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
                value={twitter}
                placeholder="twitter.com/johnsmith"
                onChange={(event) => setTwitter(event.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-700 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="youtube"
              className="block text-sm font-semibold leading-6 text-slate-50"
            >
              Youtube
              <span className="text-xs font-normal text-zinc-500 pl-1">
                (Optional)
              </span>
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                id="youtube"
                name="youtube"
                value={youtube}
                placeholder="youtube.com/johnsmith"
                onChange={(event) => setYoutube(event.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-700 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <button
            type="button"
            className="sm:col-span-2 w-full ring-1 ring-rose-600  transition-all  hover:bg-rose-600 text-slate-50 font-semibold py-2 px-4 rounded flex items-center justify-center sm:text-sm sm:leading-6"
            onClick={addLink}
          >
            <span>Add link</span>
          </button>
          <div
            className="sm:col-span-2
          "
          >
            {links.map((link) => (
              <div key={link.id} className="dynamicField mt-4">
                <label
                  htmlFor={`link-${link.id}`}
                  className="block text-sm font-semibold leading-6 text-slate-50"
                >
                  Link
                </label>
                <div className="relative mt-2.5">
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <label htmlFor={`link-${link.id}`} className="sr-only">
                      Link
                    </label>
                    <select
                      id={`link-${link.id}-title`}
                      name={`link-${link.id}`}
                      className="h-full rounded-md border-0 bg-transparent py-0 pl-4 pr-9 text-slate-50 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm"
                      value={link.title}
                      onChange={(e) => handleOptionChange(link.id, e)}
                    >
                      <option
                        className="bg-zinc-950 text-slate-50"
                        value="Behance"
                      >
                        Behance
                      </option>
                      <option
                        className="bg-zinc-950 text-slate-50"
                        value="Dribbble"
                      >
                        Dribbble
                      </option>
                      <option
                        className="bg-zinc-950 text-slate-50"
                        value="Github"
                      >
                        Github
                      </option>
                      <option
                        className="bg-zinc-950 text-slate-50"
                        value="Gitlab"
                      >
                        Gitlab
                      </option>
                      <option
                        className="bg-zinc-950 text-slate-50"
                        value="Pinterest"
                      >
                        Pinterest
                      </option>
                      <option
                        className="bg-zinc-950 text-slate-50"
                        value="Drive"
                      >
                        Drive
                      </option>
                      <option
                        className="bg-zinc-950 text-slate-50"
                        value="Tiktok"
                      >
                        Tiktok
                      </option>
                      <option
                        className="bg-zinc-950 text-slate-50"
                        value="Vimeo"
                      >
                        Vimeo
                      </option>
                      <option
                        className="bg-zinc-950 text-slate-50"
                        value="Portfolio"
                      >
                        Portfolio
                      </option>
                      <option
                        className="bg-zinc-950 text-slate-50"
                        value="Other"
                      >
                        Other
                      </option>
                    </select>
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      name={`link-${link.id}`}
                      id={`link-${link.id}`}
                      autoComplete="off"
                      placeholder={
                        link.title === "Other"
                          ? "Custom Link"
                          : link.title === "Behance"
                          ? "behance.net/johnsmith"
                          : link.title === "Dribbble"
                          ? "dribbble.com/johnsmith"
                          : link.title === "Github"
                          ? "github.com/johnsmith"
                          : link.title === "Gitlab"
                          ? "gitlab.com/johnsmith"
                          : link.title === "Pinterest"
                          ? "pinterest.com/johnsmith"
                          : link.title === "Drive"
                          ? "drive.google.com/johnsmith"
                          : link.title === "Tiktok"
                          ? "tiktok.com/johnsmith"
                          : link.title === "Vimeo"
                          ? "vimeo.com/johnsmith"
                          : link.title === "Portfolio"
                          ? "johnsmith.com"
                          : ""
                      }
                      className="block w-full rounded-md border-0 px-3.5 py-2 pl-36 bg-zinc-950 text-slate-50 shadow-sm ring-1 ring-inset ring-zinc-700 placeholder:text-zinc-700 focus:ring-1 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                      value={link.url}
                      onChange={(e) => handleUrlChange(link.id, e)}
                    />
                    <button
                      className="text-red-500 font-semibold hover:text-red-600 transition-all pl-2 text-xl"
                      onClick={() => removeLink(link.id)}
                    >
                      x
                    </button>
                  </div>
                </div>
              </div>
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
