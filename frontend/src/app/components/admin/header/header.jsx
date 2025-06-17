"use client";
import { useState } from "react";
import { LogOut, User } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      router.push("/"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="h-16 bg-black text-white flex justify-end items-center px-6 shadow-md">
      {/* <h1 className="text-xl font-bold">Weave Admin</h1> */}

      <div className="relative">
        <div
          onClick={() => setShowMenu((prev) => !prev)}
          className="cursor-pointer flex items-center gap-2 hover:opacity-90"
        >
          <User className="w-6 h-6" />
        </div>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md">
            <button
              onClick={handleLogout}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 w-full hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 " />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
