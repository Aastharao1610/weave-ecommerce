"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "@/app/components/modal/Modal";

export default function ProductCard({ product, onEdit, onDeleted }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${product.id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Product deleted");
      onDeleted();
    } catch (err) {
      toast.error("Error deleting product");
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.images?.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].altText || product.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image available</span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 text-sm text-gray-800">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-black">{product.name}</h3>
          <div className="text-green-600 font-semibold">
            ₹{product.basePrice}
          </div>
        </div>

        <p className="text-gray-500 text-xs line-clamp-2">
          {product.description}
        </p>

        {product.variant?.length > 0 && (
          <div className="bg-gray-50 p-2 rounded-md border text-xs mt-2 space-y-1">
            {product.variant.map((v, idx) => (
              <div
                key={idx}
                className="flex justify-between border-b last:border-none pb-1 last:pb-0 text-gray-700"
              >
                <span>
                  {v.color} / {v.size}
                </span>
                <span className="text-gray-900 font-medium">
                  ₹{v.price} ({v.stock} pcs)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t px-4 py-3 flex justify-end items-center gap-4">
        <button
          onClick={() => onEdit(product)}
          className="text-blue-600 hover:text-blue-800 transition"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-red-600 hover:text-red-800 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {isModalOpen && (
        <ConfirmModal
          isOpen={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete product"
          message="Are you sure you want to delete this Product? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmClass="bg-red-600 hover:bg-red-700 text-white"
        />
      )}
    </div>
  );
}
