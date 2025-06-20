"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      console.log(res);
      console.log(res.data);
      console.log(res.data.product);
      const allProducts = res.data.product || [];
      setProducts(allProducts.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  //   const productImage = async () => {
  //     try {
  //       const responseImage = await axios.get(
  //         "http://localhost:5000/api/productImages"
  //       );
  //       console.log(responseImage, "responseImage");
  //       console.log(responseImage.productId.url, "product Url");
  //       const allImages = responseImage.data.url || [];
  //       setImages(allImages.slice(0, 5));
  //     } catch (error) {
  //       console.error("Failed to fetch Images", error);
  //     }
  //   };

  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/productImages");
      const allImages = res.data || [];
      setImages(allImages);
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchImages();
  }, []);

  return (
    <section className="py-16 px-8">
      <h2 className="text-3xl text-black font-semibold mb-10 text-center">
        Top Picks
      </h2>
      <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => {
          const image = images.find((img) => img.productId === product.id);
          return (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full h-60">
                {image ? (
                  <Image
                    src={image.url}
                    alt={image.altText?.trim() || product.name}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg text-black font-medium">
                  {product.name}
                </h3>
                {/* <p className="text-sm text-gray-600 mt-1">
                    {product.description}
                  </p> */}
                <p className="text-md font-semibold text-black mt-2">
                  ₹{product.basePrice}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Products;
