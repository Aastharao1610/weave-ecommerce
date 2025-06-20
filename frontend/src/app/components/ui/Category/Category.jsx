"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import axios from "axios";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/category/");
      console.log(response);
      console.log("Fetched categories:", response.data, response.data.category);

      setCategories(response.data.category || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useMemo(() => fetchCategories, []);

  return (
    <section className="py-6 px-8 text-center">
      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : (
        <div className="flex justify-center gap-10 flex-wrap">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-3">
              <div className="w-20 h-20 cursor-pointer sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-100 shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  width={100} // Tailwind w-28
                  height={112}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-md text-black font-medium capitalize">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Category;
