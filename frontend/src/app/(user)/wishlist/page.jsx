"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import ConfirmModal from "@/app/components/modal/Modal";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data, "wishlist response");
      setWishlist(res.data.wishlist?.items || []);
      console.log("🧾 Wishlist item example", res.data.wishlist?.items?.[0]);
      console.log(
        "Product with images →",
        res.data.wishlist?.items?.[0]?.product
      );
      console.log(
        "Image URL →",
        res.data.wishlist?.items?.[0]?.product?.images?.[0]?.url
      );
    } catch (error) {
      toast.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!modalItem || !modalType) return;

    try {
      if (modalType === "cart") {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cart/create`,
          {
            productVariantId: modalItem.productVariant?.id,

            quantity: 1,
          },
          { withCredentials: true }
        );
        toast.success("Moved to cart");
      } else if (modalType === "remove") {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/delete/${modalItem.id}`,
          { withCredentials: true }
        );
        toast.success("Removed from wishlist");
      }
      fetchWishlist();
    } catch (error) {
      toast.error("Action failed");
      console.error(error);
    } finally {
      setModalItem(null);
      setModalType(null);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center text-gray-600">
        Loading your wishlist...
      </div>
    );
  }
  //   const imageUrl = product.images?.[0]?.url;

  return (
    <section className="bg-white min-h-screen py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {wishlist.length === 0 ? (
          <div className="text-center text-gray-600 text-lg mt-16">
            Your wishlist is currently empty.
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md"
              >
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

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {item.product?.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {item.product?.description}
                  </p>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    ₹{item.productVariant.price}
                  </p>

                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => {
                        setModalItem(item);
                        setModalType("cart");
                      }}
                      className="text-sm text-indigo-600 font-medium hover:underline"
                    >
                      Move to Bag
                    </button>
                    <button
                      onClick={() => {
                        setModalItem(item);
                        setModalType("remove");
                      }}
                      className="text-sm text-red-600 font-medium hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalItem && (
        <ConfirmModal
          isOpen={Boolean(modalItem)}
          title={
            modalType === "cart" ? "Move to Bag?" : "Remove from Wishlist?"
          }
          description={
            modalType === "cart"
              ? "Do you want to move this item to your bag?"
              : "Are you sure you want to remove this item from your wishlist?"
          }
          onConfirm={handleConfirm}
          onCancel={() => {
            setModalItem(null);
            setModalType(null);
          }}
        />
      )}
    </section>
  );
};

export default WishlistPage;
