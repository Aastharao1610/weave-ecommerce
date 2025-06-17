"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  Layers,
  Shirt,
  ShoppingCart,
  Users,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    href: "/admin/dashboard",
  },
  { name: "Categories", icon: <Boxes size={20} />, href: "/admin/categories" },
  {
    name: "Subcategories",
    icon: <Layers size={20} />,
    href: "/admin/subcategories",
  },
  { name: "Products", icon: <Shirt size={20} />, href: "/admin/products" },
  { name: "Orders", icon: <ShoppingCart size={20} />, href: "/admin/orders" },
  { name: "Users", icon: <Users size={20} />, href: "/admin/users" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-black text-white shadow-lg fixed top-0 left-0 flex flex-col">
      <div className="text-xl font-bold p-6 border-b border-gray-700">
        Weave Admin
      </div>
      <nav className="flex flex-col gap-2 p-4 my-3 text-sm font-xl">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2  my-1 rounded hover:bg-gray-800 transition ${
              pathname === item.href ? "bg-gray-800" : ""
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
