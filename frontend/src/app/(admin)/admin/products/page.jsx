"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/app/components/admin/products/productCard/ProductCard";
import ProductForm from "@/app/components/admin/products/productForm/productForm";
import { toast } from "react-toastify";

export default function ProductPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // Load categories + subcategories
  const loadCategories = async () => {
    const res = await axios.get(`${process.env.BACKEND_URL}/api/Category`, {
      withCredentials: true,
    });
    setCategories(res.data.category);
  };

  const loadProducts = async () => {
    const res = await axios.get(`${process.env.BACKEND_URL}/api/products`, {
      withCredentials: true,
    });
    console.log(res.data.product);
    setProducts(res.data.product);
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [refresh]);

  const handleFormSuccess = () => {
    setRefresh(!refresh);
    setShowModal(false);
    setEditData(null);
  };

  const handleEditClick = (product) => {
    setEditData(product);
    setShowModal(true);
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Manage Products</h2>
        <button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="bg-black text-white px-4 py-2 text-md rounded hover:bg-gray-800 cursor-pointer"
        >
          + Create Product
        </button>
      </div>

      {categories.map((cat) => (
        <div key={cat.id} className="mb-6">
          <h3 className="text-xl font-bold text-black mb-2">{cat.name}</h3>

          {cat.Subcategory?.map((sub) => (
            <div key={sub.id} className="ml-4 mb-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-1">
                {sub.name}
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(products || [])
                  .filter((p) => p.subcategoryId === sub.id)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEditClick}
                      onDeleted={() => setRefresh((prev) => !prev)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 cursor-pointer text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl text-black font-semibold mb-4">
              {editData ? "Edit Product" : "Create Product"}
            </h3>
            <ProductForm
              initialData={editData}
              categories={categories}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
