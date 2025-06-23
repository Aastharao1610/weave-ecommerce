"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      setCartItems(res.data.cart.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/delete/${itemId}`, {
        withCredentials: true,
      });
      toast.success("Item removed from cart");
      fetchCart();
    } catch (err) {
      console.error("Remove failed:", err);
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (acc, item) => acc + item.productVariant.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center text-gray-600">
        Loading your cart...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center text-gray-600">
        Your cart is currently empty.
      </div>
    );
  }

  return (
    <section className="bg-white min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md"
            >
              {/* Image */}
              <div className="w-full h-60 bg-white border-b relative">
                {item.productVariant?.product?.images?.[0]?.url ? (
                  <Image
                    src={item.productVariant.product.images[0].url}
                    alt={item.productVariant.product.name || "Product Image"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {item.productVariant.product.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {item.productVariant.product.description}
                </p>

                <div className="mt-2 text-sm text-gray-600">
                  Color:{" "}
                  <span className="font-medium">
                    {item.productVariant.color}
                  </span>{" "}
                  | Size:{" "}
                  <span className="font-medium">
                    {item.productVariant.size}
                  </span>
                </div>

                <div className="mt-1 text-sm text-gray-600">
                  Quantity: <span className="font-medium">{item.quantity}</span>
                </div>

                <p className="text-lg font-bold text-gray-900 mt-2">
                  ₹{item.productVariant.price * item.quantity}
                </p>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-sm text-red-600 font-medium hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-10 flex justify-between items-center border-t pt-6">
          <span className="text-xl font-semibold">Total</span>
          <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
        </div>

        <button className="mt-6 bg-black text-white px-6 py-3 rounded-full w-full md:w-fit">
          Proceed to Checkout
        </button>
      </div>
    </section>
  );
};

export default CartPage;
