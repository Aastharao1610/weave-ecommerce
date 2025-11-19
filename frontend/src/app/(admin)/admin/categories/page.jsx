"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CategoryCard from "@/app/components/admin/Category/CategoryCard/CategoryCard";
import CategoryForm from "@/app/components/admin/Category/CategoryForm/CategoryForm";
import { toast } from "react-toastify";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.BACKEND_URL}/api/category`, {
        withCredentials: true,
      });
      setCategories(res.data.category);
    } catch (err) {
      toast.error("Failed to fetch categories");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  const handleFormSuccess = () => {
    setRefresh(!refresh);
    setShowModal(false);
    setEditData(null);
  };

  const handleEditClick = (category) => {
    setEditData(category);
    setShowModal(true);
  };

  return (
    <div className="p-4 space-y-8 ">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Manage Categories</h2>
        <button
          onClick={() => {
            setEditData(null); // 👈 reset to create mode
            setShowModal(true);
          }}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
        >
          + Create Category
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-xs bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 cursor-pointer text-xl font-bold text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <CategoryForm
              editMode={!!editData}
              initialData={editData || {}}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}

      {/* Category List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onDeleted={() => setRefresh((prev) => !prev)}
            onEdit={() => handleEditClick(cat)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
