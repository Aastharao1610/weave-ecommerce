// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import axios from "axios";
// import { toast } from "react-toastify";

// const PaymentSuccessPage = () => {
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get("orderId");

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         if (!orderId) {
//           toast.error("Missing order ID");
//           return;
//         }

//         const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
//           withCredentials: true,
//         });

//         setOrder(res.data.order);
//       } catch (err) {
//         toast.error("Failed to fetch order details");
//         console.error("Order fetch failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [orderId]);

//   if (loading) return <div className="p-10">Loading your order...</div>;

//   if (!order) return <div className="p-10 text-red-500">Order not found.</div>;

//   return (
//     <div className="p-10 bg-white min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">Thank You! 🎉</h1>
//       <p className="mb-4">Your order #{order.id} has been placed successfully.</p>

//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
//         <ul className="space-y-4">
//           {order.items.map((item) => (
//             <li key={item.id} className="border p-4 rounded">
//               <p className="font-medium">{item.productVariant.product.name}</p>
//               <p className="text-sm">Color: {item.productVariant.color}</p>
//               <p className="text-sm">Size: {item.productVariant.size}</p>
//               <p className="text-sm">
//                 ₹{item.priceAtPurchase} x {item.quantity} = ₹
//                 {item.priceAtPurchase * item.quantity}
//               </p>
//             </li>
//           ))}
//         </ul>

//         <div className="mt-6 text-lg font-bold">
//           Total Paid: ₹{order.total.toFixed(2)}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccessPage;

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

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
          `http://localhost:5000/api/orders/${orderId}`,
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

export default PaymentSuccessPage;
