// components/admin/CategoryForm.jsx
"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CategoryForm = ({ onSuccess, editMode = false, initialData = {} }) => {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(initialData.imageUrl || null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  //   e.preventDefault();

  //   if (!name || !description || !image) {
  //     toast.error("All fields are required");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("name", name);
  //   formData.append("description", description);
  //   formData.append("image", image); // req.file on server

  //   try {
  //     setLoading(true);
  //     await axios.post("http://localhost:5000/api/category/create", formData, {
  //       withCredentials: true,
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     toast.success("Category Created!");
  //     setName("");
  //     setDescription("");
  //     setImage(null);
  //     setPreview(null);
  //     onSuccess();
  //   } catch (err) {
  //     toast.error("Creation failed");
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const handleSubmit = async (e) => {

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      toast.error("Name and Description are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);

      if (editMode && initialData.id) {
        await axios.put(
          `http://localhost:5000/api/category/update/${initialData.id}`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(initialData);
        toast.success("Category Updated!");
      } else {
        await axios.post(
          "http://localhost:5000/api/category/create",
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Category Created!");
      }

      setName("");
      setDescription("");
      setImage(null);
      setPreview(null);
      onSuccess();
    } catch (err) {
      toast.error(editMode ? "Update failed" : "Creation failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-5  "
    >
      <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2">
        Create New Category
      </h3>

      <div>
        <label className="block text-gray-800 mb-1 font-medium">Name</label>
        <input
          type="text"
          placeholder="Enter category name"
          className="w-full border border-gray-300 p-3 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-gray-800 mb-1 font-medium">
          Description
        </label>
        <textarea
          placeholder="Write a short description"
          className="w-full border border-gray-300 text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-gray-800 mb-1 font-medium">
          Category Image
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border text-gray-800 cursor-pointer border-gray-300 p-2 rounded-lg"
        />
      </div>

      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-3 cursor-pointer rounded-lg font-medium hover:bg-gray-800 transition duration-200"
      >
        {loading
          ? editMode
            ? "Updating..."
            : "Creating..."
          : editMode
          ? "Update Category"
          : "Create Category"}
      </button>
    </form>
  );
};

export default CategoryForm;
