"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProductForm({ initialData, categories, onSuccess }) {
  const safeData = initialData ?? {};
  const [name, setName] = useState(safeData.name || "");
  const [description, setDescription] = useState(safeData.description || "");
  const [basePrice, setBasePrice] = useState(safeData.basePrice || "");
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState(safeData.variant || []);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState(
    safeData.subcategoryId || ""
  );
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  useEffect(() => {
    if (safeData.subcategoryId) {
      const found = categories.find((cat) =>
        cat.Subcategory.some((sub) => sub.id === safeData.subcategoryId)
      );
      if (found) setSelectedCategoryId(found.id);
    }
  }, [safeData, categories]);

  useEffect(() => {
    if (selectedCategoryId) {
      const selectedCat = categories.find(
        (cat) => cat.id === parseInt(selectedCategoryId)
      );
      setFilteredSubcategories(selectedCat?.Subcategory || []);
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategoryId, categories]);

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { color: "", size: "", price: "", stock: "", sku: "" },
    ]);
  };

  const removeVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("baseprice", basePrice);
    formData.append("subcategoryId", subcategoryId);
    formData.append("variant", JSON.stringify(variants));
    images.forEach((img) => formData.append("images", img));

    try {
      if (safeData.id) {
        await axios.put(
          `http://localhost:5000/api/products/update/${safeData.id}`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post(
          `http://localhost:5000/api/products/create`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.success("Product created successfully");
      }
      onSuccess();
    } catch (err) {
      toast.error("Error submitting product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-black">
      {/* Product Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Base Price</label>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          rows={3}
        />
      </div>

      {/* Category Select */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setSubcategoryId("");
            }}
            required
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Subcategory</label>
          <select
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="">Select Subcategory</option>
            {filteredSubcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block mb-1 font-medium">Product Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files))}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      {/* Variants */}
      <div>
        <label className="block mb-2 font-semibold">Variants</label>
        {variants.map((variant, idx) => (
          <div key={idx} className="grid grid-cols-6 gap-2 items-center mb-2">
            <input
              placeholder="Color"
              value={variant.color}
              onChange={(e) =>
                handleVariantChange(idx, "color", e.target.value)
              }
              className="border px-2 py-1 rounded col-span-1"
            />
            <input
              placeholder="Size"
              value={variant.size}
              onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
              className="border px-2 py-1 rounded col-span-1"
            />
            <input
              placeholder="SKU"
              value={variant.sku}
              onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
              className="border px-2 py-1 rounded col-span-1"
            />
            <input
              type="number"
              placeholder="Price"
              value={variant.price}
              onChange={(e) =>
                handleVariantChange(idx, "price", e.target.value)
              }
              className="border px-2 py-1 rounded col-span-1"
            />
            <input
              type="number"
              placeholder="Stock"
              value={variant.stock}
              onChange={(e) =>
                handleVariantChange(idx, "stock", e.target.value)
              }
              className="border px-2 py-1 rounded col-span-1"
            />
            <button
              type="button"
              onClick={() => removeVariant(idx)}
              className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addVariant}
          className="text-sm mt-2 bg-gray-100 hover:bg-gray-200 border rounded px-4 py-1"
        >
          + Add Variant
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-black text-white w-full py-3 rounded-md font-semibold hover:bg-gray-900"
      >
        {safeData.id ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
