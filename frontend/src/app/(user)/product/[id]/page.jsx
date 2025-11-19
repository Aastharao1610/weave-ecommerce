// app/product/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟡 Optional user info fetch (better for scaling)
  const checkLogin = async () => {
    try {
      await axios.get("/api/me", { withCredentials: true });
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.BACKEND_URL}/api/products/${id}`,
          {
            withCredentials: true,
          }
        );

        setProduct(res.data.product);
        setImage(res.data.image);
      } catch (err) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    const loggedIn = await checkLogin();
    if (!loggedIn) return toast.error("Please login to add to cart");

    try {
      await axios.post(
        "/api/cart/add",
        { productId: product.id, quantity: 1 },
        { withCredentials: true }
      );
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleAddToWishlist = async () => {
    const loggedIn = await checkLogin();
    if (!loggedIn) return toast.error("Please login to wishlist");

    try {
      await axios.post(
        "/api/wishlist/add",
        { productId: product.id },
        { withCredentials: true }
      );
      toast.success("Added to wishlist");
    } catch {
      toast.error("Failed to add to wishlist");
    }
  };

  if (loading) {
    return <p className="text-center py-20">Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="w-full h-[500px] relative bg-gray-100 rounded-md overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.name}
            layout="fill"
            objectFit="contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="space-y-4">
        {/* <h1 className="text-3xl font-bold text-black">{product.name}</h1> */}
        <p className="text-gray-600">{product.description}</p>
        <p className="text-2xl font-bold text-black">₹{product.basePrice}</p>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90 transition"
          >
            Add to Cart
          </button>
          <button
            onClick={handleAddToWishlist}
            className="border border-black text-black px-6 py-2 rounded-full hover:bg-black hover:text-white transition"
          >
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
