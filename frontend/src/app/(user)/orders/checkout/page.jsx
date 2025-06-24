// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";

// const CheckoutPage = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [savedAddress, setSavedAddress] = useState(null);
//   const [useSaved, setUseSaved] = useState(false);
//   const [loading, setLoading] = useState(true);
// const [saveAddressChecked, setSaveAddressChecked] = useState(false);

//   const [form, setForm] = useState({
//     shippingName: "",
//     shippingPhone: "",
//     shippingStreet: "",
//     shippingCity: "",
//     shippingState: "",
//     shippingPostalCode: "",
//     shippingCountry: "",
//   });

//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const cartRes = await axios.get("http://localhost:5000/api/cart", {
//           withCredentials: true,
//         });
//         const items = cartRes.data.cart?.items || [];
//         setCartItems(items);
//         setSelectedItems(items.map((item) => item.id));

//         const addressRes = await axios.get(
//           "http://localhost:5000/api/user/address",
//           { withCredentials: true }
//         );
//         if (addressRes.data?.address) {
//           setSavedAddress(addressRes.data.address);
//         }
//       } catch (err) {
//         toast.error("Failed to load cart or address");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleInputChange = (e) => {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

// const handlePlaceOrder = async () => {
//   try {
//     const selectedCartVariants = cartItems
//       .filter((item) => selectedItems.includes(item.id))
//       .map((item) => ({
//         productVariantId: item.productVariantId,
//         quantity: item.quantity,
//       }));

//     if (selectedCartVariants.length === 0) {
//       toast.error("Please select at least one item");
//       return;
//     }

//     const address = useSaved && savedAddress ? savedAddress : form;

//     const required = [
//       "shippingName",
//       "shippingPhone",
//       "shippingStreet",
//       "shippingCity",
//       "shippingState",
//       "shippingPostalCode",
//       "shippingCountry",
//     ];
//     for (let field of required) {
//       if (!address[field]) {
//         toast.error(`Missing: ${field}`);
//         return;
//       }
//     }

//     // 🧠 Step 1: Save address (if checkbox selected)
//     if (!useSaved && saveAddressChecked) {
//       await axios.post("http://localhost:5000/api/user/address/save", address, {
//         withCredentials: true,
//       });
//       toast.success("Address saved successfully");
//     }

//     // 🧠 Step 2: Place Order
//     const res = await axios.post(
//       "http://localhost:5000/api/orders/create",
//       {
//         ...address,
//         items: selectedCartVariants,
//       },
//       { withCredentials: true }
//     );

//     toast.success("Order placed successfully!");
//     router.push(`/orders/${res.data.order.id}`);
//   } catch (err) {
//     console.error("Order error:", err);
//     toast.error(err.response?.data?.error || "Failed to place order");
//   }
// };

//   if (loading)
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-white text-black">
//         Loading...
//       </div>
//     );

//   return (
//     <div className="bg-white min-h-screen text-black py-10 px-4 sm:px-6 lg:px-20">
//       <h1 className="text-3xl font-bold mb-8 text-center text-black">
//         Checkout
//       </h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//         {/* Address Form */}
//         <div className="bg-gray-100 p-6 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold mb-4 text-black">
//             Shipping Address
//           </h2>

//           {savedAddress && (
//             <div className="bg-white p-4 rounded mb-4 border border-gray-300">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={useSaved}
//                   onChange={() => setUseSaved(!useSaved)}
//                 />
//                 <span>Use saved address</span>
//               </label>

//               {useSaved && (
//                 <div className="text-sm mt-3 text-gray-700 space-y-1">
//                   <p>{savedAddress.shippingName}</p>
//                   <p>{savedAddress.shippingStreet}</p>
//                   <p>
//                     {savedAddress.shippingCity}, {savedAddress.shippingState}{" "}
//                     {savedAddress.shippingPostalCode}
//                   </p>
//                   <p>{savedAddress.shippingCountry}</p>
//                   <p>Phone: {savedAddress.shippingPhone}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {!useSaved && (
//             <div className="grid gap-3">
//               {[
//                 "shippingName",
//                 "shippingPhone",
//                 "shippingStreet",
//                 "shippingCity",
//                 "shippingState",
//                 "shippingPostalCode",
//                 "shippingCountry",
//               ].map((field) => (
//                 <input
//                   key={field}
//                   name={field}
//                   placeholder={field.replace("shipping", "")}
//                   className="bg-white border border-gray-300 p-2 rounded text-black placeholder-gray-500"
//                   value={form[field]}
//                   onChange={handleInputChange}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Cart Summary */}
//         <div className="bg-gray-100 p-6 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold mb-4 text-black">
//             Order Summary
//           </h2>

//           <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
//             {cartItems
//               .filter((item) => selectedItems.includes(item.id))
//               .map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex justify-between items-start border-b border-gray-300 pb-2"
//                 >
//                   <div>
//                     <p className="text-black font-medium">
//                       {item.productVariant.product.name}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Qty: {item.quantity}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Price: ₹{item.productVariant.price}
//                     </p>
//                   </div>
//                   <p className="text-black font-semibold">
//                     ₹{item.productVariant.price * item.quantity}
//                   </p>
//                 </div>
//               ))}
//           </div>

//           <div className="border-t border-gray-300 mt-6 pt-4 flex justify-between text-lg font-bold text-black">
//             <span>Total</span>
//             <span>
//               ₹
//               {cartItems
//                 .filter((item) => selectedItems.includes(item.id))
//                 .reduce(
//                   (acc, item) =>
//                     acc + item.productVariant.price * item.quantity,
//                   0
//                 )
//                 .toFixed(2)}
//             </span>
//           </div>

//           <button
//             onClick={handlePlaceOrder}
//             className="mt-6 w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
//           >
//             Place Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [savedAddress, setSavedAddress] = useState(null);
  const [useSaved, setUseSaved] = useState(false);
  const [saveAddressChecked, setSaveAddressChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingPostalCode: "",
    shippingCountry: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartRes = await axios.get("http://localhost:5000/api/cart", {
          withCredentials: true,
        });
        const items = cartRes.data.cart?.items || [];
        setCartItems(items);
        setSelectedItems(items.map((item) => item.id));

        const addressRes = await axios.get(
          "http://localhost:5000/api/user/address",
          { withCredentials: true }
        );
        if (addressRes.data?.address) {
          setSavedAddress(addressRes.data.address);
        }
      } catch (err) {
        toast.error("Failed to load cart or address");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async () => {
    try {
      const selectedCartVariants = cartItems
        .filter((item) => selectedItems.includes(item.id))
        .map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        }));

      if (selectedCartVariants.length === 0) {
        toast.error("Please select at least one item");
        return;
      }

      const address = useSaved && savedAddress ? savedAddress : form;

      const required = [
        "shippingName",
        "shippingPhone",
        "shippingStreet",
        "shippingCity",
        "shippingState",
        "shippingPostalCode",
        "shippingCountry",
      ];
      for (let field of required) {
        if (!address[field]) {
          toast.error(`Missing: ${field}`);
          return;
        }
      }

      // Save address if new and checkbox selected
      if (!useSaved && saveAddressChecked) {
        await axios.post(
          "http://localhost:5000/api/user/address/save",
          address,
          {
            withCredentials: true,
          }
        );
        toast.success("Address saved");
      }

      // 1. Place order
      const orderRes = await axios.post(
        "http://localhost:5000/api/orders/create",
        {
          ...address,
          items: selectedCartVariants,
        },
        { withCredentials: true }
      );

      const orderId = orderRes.data.order.id;
      toast.success("Order placed! Redirecting to payment...");

      // 2. Create Stripe session
      const paymentRes = await axios.post(
        `http://localhost:5000/api/payments/checkoutSession/${orderId}`,
        { withCredentials: true }
      );

      const { url } = paymentRes.data;

      // 3. Redirect to Stripe
      window.location.href = url;
    } catch (err) {
      console.error("Order/payment error:", err);
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-white text-black">
        Loading...
      </div>
    );

  return (
    <div className="bg-white min-h-screen text-black py-10 px-4 sm:px-6 lg:px-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Address Form */}
        <div className="bg-gray-100 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Shipping Address
          </h2>

          {savedAddress && (
            <div className="bg-white p-4 rounded mb-4 border border-gray-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useSaved}
                  onChange={() => setUseSaved(!useSaved)}
                />
                <span>Use saved address</span>
              </label>

              {useSaved && (
                <div className="text-sm mt-3 text-gray-700 space-y-1">
                  <p>{savedAddress.shippingName}</p>
                  <p>{savedAddress.shippingStreet}</p>
                  <p>
                    {savedAddress.shippingCity}, {savedAddress.shippingState}{" "}
                    {savedAddress.shippingPostalCode}
                  </p>
                  <p>{savedAddress.shippingCountry}</p>
                  <p>Phone: {savedAddress.shippingPhone}</p>
                </div>
              )}
            </div>
          )}

          {!useSaved && (
            <>
              <div className="grid gap-3">
                {[
                  "shippingName",
                  "shippingPhone",
                  "shippingStreet",
                  "shippingCity",
                  "shippingState",
                  "shippingPostalCode",
                  "shippingCountry",
                ].map((field) => (
                  <input
                    key={field}
                    name={field}
                    placeholder={field.replace("shipping", "")}
                    className="bg-white border border-gray-300 p-2 rounded text-black placeholder-gray-500"
                    value={form[field]}
                    onChange={handleInputChange}
                  />
                ))}
              </div>

              {/* Save address checkbox */}
              <label className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={saveAddressChecked}
                  onChange={() => setSaveAddressChecked(!saveAddressChecked)}
                />
                <span className="text-sm text-gray-700">
                  Save this address for future orders
                </span>
              </label>
            </>
          )}
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-100 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Order Summary
          </h2>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {cartItems
              .filter((item) => selectedItems.includes(item.id))
              .map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border-b border-gray-300 pb-2"
                >
                  <div>
                    <p className="text-black font-medium">
                      {item.productVariant.product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: ₹{item.productVariant.price}
                    </p>
                  </div>
                  <p className="text-black font-semibold">
                    ₹{item.productVariant.price * item.quantity}
                  </p>
                </div>
              ))}
          </div>

          <div className="border-t border-gray-300 mt-6 pt-4 flex justify-between text-lg font-bold text-black">
            <span>Total</span>
            <span>
              ₹
              {cartItems
                .filter((item) => selectedItems.includes(item.id))
                .reduce(
                  (acc, item) =>
                    acc + item.productVariant.price * item.quantity,
                  0
                )
                .toFixed(2)}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
