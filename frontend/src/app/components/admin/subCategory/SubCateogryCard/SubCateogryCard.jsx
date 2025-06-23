"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteConfirmationModal from "../../../modal/Modal";
import toast from "react-hot-toast";
import axios from "axios";

const SubcategoryCard = ({ subcategory, onEdit, onDeleted }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/subCategory/${subcategory.id}`,
        {
          withCredentials: true,
        }
      );
      console.log("Deleting subcategory with ID:", subcategory.id);
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
    <div className="min-w-[180px] bg-white border border-gray-200 rounded p-3 shadow-sm flex flex-col justify-between ">
      <img
        src={subcategory.imageUrl}
        alt={subcategory.name}
        className="h-28 w-full object-cover rounded mb-2"
      />
      <p className="font-medium text-gray-800 truncate">{subcategory.name}</p>
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => onEdit(subcategory)}
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

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default SubcategoryCard;
