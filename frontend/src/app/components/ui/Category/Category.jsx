// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import Image from "next/image";
// import axios from "axios";

// const Category = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(`${process.env.BACKEND_URL}/api/category/");
//       console.log(response);
//       console.log("Fetched categories:", response.data, response.data.category);

//       setCategories(response.data.category || []);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useMemo(() => fetchCategories, []);

//   return (
//     <section className="py-6 px-8 text-center">
//       {loading ? (
//         <p className="text-gray-500">Loading categories...</p>
//       ) : (
//         <div className="flex justify-center gap-10 flex-wrap">
//           {categories.map((cat, idx) => (
//             <div key={idx} className="flex flex-col items-center space-y-3">
//               <div className="w-20 h-20 cursor-pointer sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-100 shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
//                 <Image
//                   src={cat.imageUrl}
//                   alt={cat.name}
//                   width={100} // Tailwind w-28
//                   height={112}
//                   className="object-cover w-full h-full"
//                 />
//               </div>
//               <p className="text-md text-black font-medium capitalize">
//                 {cat.name}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default Category;

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const CategoryNav = () => {
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.BACKEND_URL}/api/category`);
        console.log(res.data);
        setCategories(res.data.category || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex items-center gap-10 ml-2">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="relative group"
          onMouseEnter={() => setActiveCat(cat)}
          onMouseLeave={() => setActiveCat(null)}
        >
          <span className="text-sm text-black cursor-pointer uppercase font-semibold hover:text-blue-600">
            {cat.name}
          </span>

          {/* Subcategory dropdown */}
          {/* {activeCat?.id === cat.id && cat.Subcategory?.length > 0 && (
            <div className="absolute left-0 top-full mt-6 w-64 bg-white shadow-lg border  z-50 p-4 overflow-hidden">
              <ul className="space-y-2 text-sm text-gray-700 animate-fade-in">
                {cat.Subcategory.map((sub, i) => (
                  <li
                    key={sub.id}
                    style={{ animationDelay: `${i * 80}ms` }}
                    className="opacity-0 animate-fade-in-item"
                  >
                    <Link
                      href={`/products/${sub.id}`}
                      className="block hover:text-blue-600"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )} */}
          {activeCat?.id === cat.id && cat.Subcategory?.length > 0 && (
            <div className="absolute left-0 top-full mt-6 w-64 bg-white shadow-lg border z-50 p-4">
              <ul className="space-y-2 text-sm text-gray-700">
                {cat.Subcategory.map((sub) => (
                  <li key={sub.id}>
                    <Link
                      href={`/products/${sub.id}`}
                      className="block hover:text-blue-600 transition-all text-sm capitalize font-semibold duration-200"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryNav;
