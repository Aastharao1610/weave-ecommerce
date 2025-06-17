"use client";
import React, { useState, useEffect } from "react";
import AdminCard from "@/app/components/admin/AdminCard/AdminCard";
import { Package, Users, Layers, ShoppingCart, Boxes } from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    categories: 0,
    orders: 0,
    subcategories: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const baseURL = "http://localhost:5000/api";

        const [productsRes, categoriesRes, subcategoriesRes] =
          await Promise.all([
            axios.get(`${baseURL}/products/`, { withCredentials: true }),
            axios.get(`${baseURL}/category/`, { withCredentials: true }),
            axios.get(`${baseURL}/subCategory/`, { withCredentials: true }),
          ]);

        console.log("productsRes:", productsRes);
        console.log("categoriesRes:", categoriesRes);
        console.log("subcategoriesRes:", subcategoriesRes);

        setStats({
          products: productsRes.data.product.length || 0,
          categories: categoriesRes.data.category.length || 0,
          subcategories: subcategoriesRes.data.subcategory.length || 0,
        });
      } catch (err) {
        console.error("Error loading admin dashboard data", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 my-5 ">
      <AdminCard title="Total Products" value={stats.products} icon={Package} />
      <AdminCard title="Total Users" value={52} icon={Users} />
      <AdminCard title="Categories" value={stats.categories} icon={Boxes} />
      <AdminCard title="Orders" value={12} icon={ShoppingCart} />
      <AdminCard
        title="Subcategories"
        value={stats.subcategories}
        icon={Layers}
      />
    </div>
  );
};

export default AdminDashboard;
