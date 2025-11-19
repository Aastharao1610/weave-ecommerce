"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function SubcategoryForm({
  onSuccess,
  initialData = {},
  editMode = false,
}) {
  const [name, setName] = useState(initialData.name || "");
  const [categoryId, setCategoryId] = useState(initialData.categoryId || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(initialData.imageUrl || null);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Category/`)
      .then((res) => {
        setCategory(res.data.category);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("categoryId", categoryId);
    formData.append("image", image);

    try {
      setLoading(true);
      if (editMode && initialData.id) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Subcategory/update/${initialData.id}`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Subcategory UPdated");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Subcategory/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        toast.success("Subcategory Created");
      }
      setName("");
      setImage(null);
      setCategoryId("");
      setPreview(null);

      onSuccess();
    } catch (error) {
      toast.error(editMode ? "Update failed" : "Creation failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Subcategory Name"
        className="border px-4 py-2 text-gray-700 w-full"
        required
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="border px-4 py-2 w-full cursor-pointer text-gray-700"
        required
      >
        <option value="">Select Category</option>
        {category.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
        className="border px-4 py-2 w-full text-gray-700 cursor-pointer"
        required
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="h-28 w-full object-cover rounded border cursor-pointer"
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-800"
      >
        {loading
          ? editMode
            ? "Updating..."
            : "Creating..."
          : editMode
          ? "Update Subcategory"
          : "Create Subategory"}
      </button>
    </form>
  );
}
