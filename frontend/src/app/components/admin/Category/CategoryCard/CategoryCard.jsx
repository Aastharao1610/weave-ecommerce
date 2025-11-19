"use client";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import ConfirmModal from "@/app/components/modal/Modal";

const CategoryCard = ({ category, onDeleted, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Category/delete/${category.id}`,
        {
          withCredentials: true,
        }
      );
      console.log("Deleting category with ID:", category.id);
      toast.success("Category deleted");
      onDeleted();
    } catch (err) {
      toast.error("Failed to delete category");
      console.error(err);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="border border-gray-100 rounded-lg shadow-sm space-y-2 text-black">
      <img
        src={category.imageUrl}
        alt={category.name}
        className="w-full h-40 object-cover p-0 rounded"
      />
      <div className="p-4 flex justify-between">
        <div>
          <h3 className="text-lg font-bold capitalize">{category.name}</h3>
          <p className="text-sm text-gray-700">{category.description}</p>
        </div>
        <div className="flex justify-between gap-4 mt-2 text-xs">
          <button
            onClick={() => onEdit(category)}
            className="hover:text-blue-500 cursor-pointer"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="hover:text-red-500 hover:underline cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmClass="bg-red-600 hover:bg-red-700 text-white"
      />
    </div>
  );
};

export default CategoryCard;
