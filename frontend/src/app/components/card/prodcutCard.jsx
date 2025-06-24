"use client";

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import clsx from "clsx";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const ProductCard = ({ product }) => {
  const router = useRouter();

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCart, setInCart] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setIsLoggedIn(true);
        console.log(" User is logged in:", res.data.user);
      } catch (error) {
        console.log("User not logged in");
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    console.log("useEffect triggered");

    const checkWishlist = async () => {
      console.log("🔍 Running checkWishlist");

      if (!isLoggedIn) {
        console.log("Not logged in");
        // router.push("/login");
        return;
      }
      console.log("🧾 Product", product);

      console.log("Logged in. Checking wishlist for product:", product.id);

      try {
        const res = await axios.get("http://localhost:5000/api/wishlist/", {
          withCredentials: true,
        });
        console.log("Wishlist response:", res.data);

        const wishlisted = res.data?.wishlist?.items?.some(
          (item) => item.productVariant?.productId === product.id
        );

        console.log("Is in wishlist?", wishlisted);
        setInWishlist(wishlisted);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };

    checkWishlist();
  }, [isLoggedIn, product.id]);

  useEffect(() => {
    const checkCart = async () => {
      if (!isLoggedIn) return;

      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          withCredentials: true,
        });

        const cartItems = res.data?.cart?.items || [];

        const inCartItem = cartItems.some(
          (item) => item.productVariant?.productId === product.id
        );

        setInCart(inCartItem);
      } catch (err) {
        console.error("Error checking cart:", err);
      }
    };

    checkCart();
  }, [isLoggedIn, product.id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to add to cart");
      router.push("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/cart/create",
        {
          productVariantId: product.variant?.[0]?.id,

          quantity: 1,
        },
        { withCredentials: true }
      );
      toast.success("Product added to cart");
      setInCart(true); // ✅ set after success
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    }
  };

  const handleToggleWishlist = async () => {
    const variantId = product.variant?.[0]?.id;
    if (!variantId) return;

    console.log("🖱️ Wishlist toggle clicked");

    if (!isLoggedIn) {
      toast.error("Please login to manage wishlist");
      router.push("/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/wishlist", {
        withCredentials: true,
      });

      const wishlistItems = res.data?.wishlist?.items || [];

      const matchedItem = wishlistItems.find(
        (item) => item.productVariant?.id === variantId
      );

      if (matchedItem) {
        console.log("🆔 Deleting item with ID:", matchedItem.id);
        await axios.delete(
          `http://localhost:5000/api/wishlist/delete/${matchedItem.id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Removed from wishlist");
        setInWishlist(false);
      } else {
        // ✅ Add fresh
        console.log("➕ Adding item to wishlist");
        await axios.post(
          "http://localhost:5000/api/wishlist/create",
          {
            productVariantId: variantId,
            quantity: 1,
          },
          {
            withCredentials: true,
          }
        );
        toast.success("Added to wishlist");
        setInWishlist(true);
      }
    } catch (err) {
      console.error("❌ Wishlist update error:", err);
      toast.error("Wishlist update failed");
    }
  };

  const imageUrl = product.images?.[0]?.url;
  return (
    <div className="relative bg-white shadow-md rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg">
      <div
        className="relative w-full h-60 cursor-pointer"
        onClick={() => router.push(`/product/${product.id}`)}
      >
        {/* Wishlist Icon */}
        <div className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow">
          {inWishlist ? (
            <AiFillHeart
              size={20}
              className="text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleWishlist();
              }}
            />
          ) : (
            <AiOutlineHeart
              size={20}
              className="text-black cursor-pointer hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleWishlist();
              }}
            />
          )}
        </div>
        {/* <button onClick={handleToggleWishlist}>Test Toggle</button> */}

        {/* Product Image Carousel */}
        {/* {imagesToShow.length > 0 ? (
          <Image
            src={imagesToShow[currentImgIndex]?.url}
            alt={imagesToShow[currentImgIndex]?.altText || product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )} */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Dots for image carousel */}
      {/* {imagesToShow.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
          {imagesToShow.map((_, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleDotClick(index);
              }}
              className={clsx(
                "h-2 w-2 rounded-full bg-white border border-gray-300 cursor-pointer",
                {
                  "bg-black": currentImgIndex === index,
                }
              )}
            ></div>
          ))}
        </div>
      )} */}

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-base font-semibold text-black">
          {product.name || "Unnamed"}
        </h3>
        <p className="text-gray-500 text-sm truncate">
          {product.description || "No description"}
        </p>
        <p className="text-black font-bold text-md">
          ₹{product.basePrice || "0"}
        </p>

        {/* Add to Cart on hover */}
        <div className="mt-2 absolute top-[200px] w-full mx-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {inCart ? (
            <button
              onClick={() => router.push("/cart")}
              className="w-full bg-black text-white py-2 text-sm font-medium"
            >
              Go to Cart
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full text-black border bg-white border-gray-100 py-2 text-sm font-medium"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
