"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SubcategorySlider from "@/app/components/admin/subCategory/subCategorySlider/subCategorySlider";
import SubcategoryForm from "@/app/components/admin/subCategory/SubCategoryForm/SubCategoryForm";
import { toast } from "react-toastify";

export default function SubcategoryPage() {
  const [category, setCategory] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/api/Category", {
      withCredentials: true,
    });
    setCategory(res.data.category);
  };

  useEffect(() => {
    load();
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
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Manage Categories</h2>
        <button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="bg-black text-white px-4 py-2 text-md rounded hover:bg-gray-800 cursor-pointer"
        >
          + Create Subcategory
        </button>
      </div>

      {category.map((cat) => (
        <div key={cat.id} className="mb-6 text-black">
          <h3 className="text-lg font-semibold mb-2">{cat.name}</h3>
          <SubcategorySlider
            subcategories={cat.Subcategory}
            onEdit={handleEditClick}
            onDeleted={() => setRefresh((prev) => !prev)}
          />
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-transparent ml-8 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 cursor-pointer text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl text-black font-semibold mb-4">
              Create Subcategory
            </h3>
            <SubcategoryForm
              editMode={!!editData}
              initialData={editData || {}}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
