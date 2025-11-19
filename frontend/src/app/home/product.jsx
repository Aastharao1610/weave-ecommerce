// app/home/Products.jsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/card/prodcutCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`
        );
        const productList = res.data.product || [];
        setProducts(productList.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    const fetchImages = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/productImages`
        );
        setImages(res.data || []);
      } catch (err) {
        console.error("Failed to fetch images:", err);
      }
    };

    fetchProducts();
    fetchImages();
  }, []);

  return (
    <section className="py-16 px-6 sm:px-12">
      <h2 className="text-3xl font-semibold text-black mb-10 text-center">
        Top Picks For You
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => {
          const image = images.find((img) => img.productId === product.id);
          return (
            <ProductCard key={product.id} product={product} image={image} />
          );
        })}
      </div>
    </section>
  );
};

export default Products;
