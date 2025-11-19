// import React from "react";
import { Heart, ShoppingCart, Search } from "lucide-react";
import { Menu } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import CategoryNav from "../../ui/Category/Category";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const Header = () => {
  const router = useRouter();
  const { user, setUser, cartCount, setCartCount } = useAuth();

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.BACKEND_URL}/api/auth/me", { withCredentials: true })
  //     .then((res) => setUser(res.data.user))
  //     .catch(() => setUser(null));
  // }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await axios.get(`${process.env.BACKEND_URL}/api/cart`, {
          withCredentials: true,
        });
        setCartCount(res.data.cart?.items?.length || 0);
      } catch (error) {
        console.error("Cart count fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCartCount();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return null; // or a skeleton header

  const handleLogout = async () => {
    await axios.post(
      `${process.env.BACKEND_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
    setUser(null);
    setCartCount(0);
    router.push("/");
  };

  return (
    <header className="w-full shadow-md py-4 px-8 flex justify-between items-center bg-white">
      <div className="flex justify-between gap-20">
        <Link href="/">
          <h1 className="text-2xl cursor-pointer font-bold text-black">
            Weave
          </h1>
        </Link>
        <CategoryNav />
      </div>

      <nav className="space-x-6 flex items-center">
        {/* Search */}
        <div className="relative mt-1 w-full max-w-md min-w-md">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full pl-10 pr-4 py-2 bg-[#F5F5F6] focus:outline-none placeholder-gray-500 text-sm"
          />
        </div>

        {/* Icons */}
        <Link href="/wishlist">
          <Heart className="mt-2 cursor-pointer text-black hover:text-blue-600" />
        </Link>
        {/* <Link href="/cart">
          <ShoppingCart className="mt-2 cursor-pointer text-black hover:text-blue-600" />
        </Link> */}

        <div className="relative">
          <Link href="/cart">
            <ShoppingCart className="mt-2 cursor-pointer text-black hover:text-blue-600" />
          </Link>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2  text-blue-600 bg-gray-100 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>

        {/* User */}
        {user ? (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300">
              <div className="w-8 h-8 rounded-full   text-black flex items-center justify-center font-semibold">
                {getInitials(user.name)}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-700" />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-4 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50">
              <div className="px-4 py-2 text-sm text-gray-600">
                Hi, {user.name}
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={`${
                        active ? "bg-gray-100" : ""
                      } block px-4 py-2 text-sm text-gray-700`}
                    >
                      My Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/orders"
                      className={`${
                        active ? "bg-gray-100" : ""
                      } block px-4 py-2 text-sm text-gray-700`}
                    >
                      My Orders
                    </Link>
                  )}
                </Menu.Item>
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } block w-full text-left px-4 py-2 text-sm text-red-600`}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        ) : (
          <Link href="/login">
            <button className="bg-black px-6 py-2 rounded-full text-white">
              Login
            </button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
