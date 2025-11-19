"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { Suspense } from "react";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}`,
          { withCredentials: true }
        );
        setOrder(res.data.order);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-black bg-white">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        Order not found or failed to fetch.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black py-16 px-4 sm:px-6 lg:px-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-green-600">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mt-4">Thank you for your order.</p>

        <div className="mt-8 text-left bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total:</strong> ₹{order.total}
          </p>
          <p>
            <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block bg-black text-white px-6 py-3 rounded-md"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

const PaymentSuccessWrapper = () => {
  return (
    <Suspense fallback={<div>Loading payment details.....</div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
};

export default PaymentSuccessWrapper;
