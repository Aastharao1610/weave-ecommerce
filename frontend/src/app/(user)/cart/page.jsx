"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import Link from "next/link";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevItemIdsRef = useRef([]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${process.env.BACKEND_URL}/api/cart`, {
        withCredentials: true,
      });

      const newItems = res.data.cart.items || [];
      const newItemIds = newItems.map((item) => item.id);
      // const prevItemIds = cartItems.map((item) => item.id);

      // Step 1: Detect truly new item IDs
      const newlyAddedIds = newItemIds.filter(
        (id) => !prevItemIdsRef.current.includes(id)
      );

      // Step 2: Add only new ones to selectedItems
      const updatedSelected = Array.from(
        new Set([...selectedItems, ...newlyAddedIds])
      );

      setCartItems(newItems);
      setSelectedItems(updatedSelected);
      prevItemIdsRef.current = newItemIds;
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productVariantId) => {
    console.log(productVariantId);
    try {
      await axios.delete(
        `${process.env.BACKEND_URL}/api/cart/delete/${productVariantId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Item removed from cart");
      fetchCart();
    } catch (err) {
      console.error("Remove failed:", err);
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = async (productVariantId, newQuantity) => {
    try {
      await axios.put(
        `${process.env.BACKEND_URL}/api/cart/update/${productVariantId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      fetchCart();
    } catch (err) {
      console.error("Quantity update failed:", err);
      toast.error("Failed to update quantity");
    }
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );

  const total = selectedCartItems.reduce(
    (acc, item) => acc + item.productVariant.price * item.quantity,
    0
  );

  useEffect(() => {
    fetchCart();
  }, []);

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
        <h2 className="text-3xl font-bold mb-6 text-black">Your Cart</h2>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="relative bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md"
            >
              {/* Checkbox Top-Left */}
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelectItem(item.id)}
                  className="w-4 h-4"
                />
              </div>

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

                <p className="text-lg font-bold text-gray-900 mt-2">
                  ₹{item.productVariant.price * item.quantity}
                </p>

                {/* Bottom Quantity Controls */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.productVariantId,
                          item.quantity - 1
                        )
                      }
                      className="px-2 py-1 bg-gray-100 text-black rounded"
                      disabled={item.quantity === 1}
                    >
                      −
                    </button>
                    <span className="text-gray-800 font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.productVariantId,
                          item.quantity + 1
                        )
                      }
                      className="px-2 py-1 bg-gray-100 text-black rounded"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item.productVariantId)}
                    className="text-sm text-red-600 font-medium hover:underline"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-10 flex justify-between items-center border-t pt-6">
          <span className="text-xl font-semibold text-black">Total</span>
          <span className="text-xl font-bold text-black">
            ₹{total.toFixed(2)}
          </span>
        </div>

        <Link
          href={{
            pathname: "/orders/checkout",
            query: { items: selectedItems.join(",") },
          }}
        >
          <button
            disabled={selectedItems.length === 0}
            className="mt-6 bg-black text-white px-6 py-3 rounded-full w-full md:w-fit disabled:opacity-50"
          >
            Place Order
          </button>
        </Link>
      </div>
    </section>
  );
};

export default CartPage;
