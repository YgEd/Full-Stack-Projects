import { KeyIcon } from "@heroicons/react/outline";

import {
  IconButton,
  Input,
  Button,
  SpeedDial,
  SpeedDialAction,
  SpeedDialContent,
  SpeedDialHandler,
} from "@material-tailwind/react";


import { useRouter} from "next/router";
import { useState } from "react";
export default function Edit() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

//   // Called when user posts a canvas image to their profile
//   const handlePost = async (e) => {
//     e.preventDefault();

//     // Extract the form data
//     const form = e.target 
//     const description = form.elements.namedItem(
//       "description"
//     ) 
   
//     if (!description || !description.value) throw "Description is null";

//     // Store canvas in firestore/cloud storage
//     await postCanvasToProfile(canvas, description.value);

//     // Send user to profile page to see new post
//     router.push("/profile");
//   };

  return (
    <div className="w-full flex flex-col items-end ">
      <SpeedDial placement="top">
        <SpeedDialHandler>
          <IconButton size="lg" className="rounded-full">
            <KeyIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
          </IconButton>
        </SpeedDialHandler>
        <SpeedDialContent className="bg-white rounded-full">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 shadow-md rounded-md">
        <h2 className="resize-none text-2xl font-semibold mb-4">Edit Form</h2>

        {/* Title Input */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-600">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 resize-none w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        {/* Author Input */}
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-medium text-gray-600">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="resize-none mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>

        {/* Description Textarea */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="resize-none mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            rows="4"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Save Changes
        </button>
      </form>
        </SpeedDialContent>
      </SpeedDial>
    </div>
  );
}
