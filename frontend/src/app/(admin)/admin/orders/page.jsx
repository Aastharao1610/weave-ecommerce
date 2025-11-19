"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${process.env.BACKEND_URL}/api/orders`, {
          withCredentials: true,
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-10 text-gray-800">All Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-xl rounded-2xl overflow-hidden">
          <thead className="bg-gray-200 text-gray-700 text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-5 text-left">Order ID</th>
              <th className="px-6 py-5 text-left">User ID</th>
              <th className="px-6 py-5 text-left">Total Price</th>
              <th className="px-6 py-5 text-left">Category</th>
              <th className="px-6 py-5 text-left">Subcategory</th>
              <th className="px-6 py-5 text-left">Status</th>
              <th className="px-6 py-5 text-left">Ordered On</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {orders.length > 0 ? (
              orders.map((order, idx) => {
                const firstItem = order.items?.[0];
                const subCategory =
                  firstItem?.productVariant?.product?.Subcategory?.name || "-";
                const category =
                  firstItem?.productVariant?.product?.Subcategory?.category
                    ?.name;

                return (
                  <tr
                    key={order.id}
                    className={`transition duration-200 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-200"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4">{order.userId}</td>
                    <td className="px-6 py-4 font-medium text-green-700">
                      ₹{order.total}
                    </td>
                    <td className="px-6 py-4">{category}</td>
                    <td className="px-6 py-4">{subCategory}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          order.status === "PENDING"
                            ? "bg-yellow-200 text-yellow-800"
                            : order.status === "DELVIERED"
                            ? "bg-green-200 text-green-800"
                            : order.status === "SHIPPED"
                            ? "bg-orange-200 text-orange-700"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {moment(order.createdAt).format("DD MMM YYYY")}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
