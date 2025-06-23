import React from "react";
import { Heart, ShoppingCart, Search } from "lucide-react";
import CategoryNav from "../../ui/Category/Category";

const Header = () => {
  return (
    <header className="w-full shadow-md py-4 px-8 flex justify-between items-center bg-white text=black">
      <div className="flex justify-between gap-20">
        <h1 className="text-2xl cursor-pointer text-black font-bold">Weave</h1>
        <CategoryNav />
      </div>
      <nav className="space-x-6 flex  ">
        <div className="relative mt-1  w-full max-w-md min-w-md">
          {/* Search Icon */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />

          {/* Input Field */}
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full pl-10 pr-4 py-2 bg-[#F5F5F6] focus:outline-none placeholder-gray-500 text-sm"
          />
        </div>

        <a href="/wishlist" className="hover:text-blue-600 text-black">
          <div className="mt-2 cursor-pointer">
            {" "}
            <Heart />
          </div>
        </a>
        <a
          href="/cart"
          className="hover:text-blue-600 text-black cursor-pointer"
        >
          <div className="mt-2">
            <ShoppingCart />
          </div>
        </a>
        <a href="/login" className="hover:text-blue-600 ">
          <button className="bg-black px-6 py-2 cursor-pointer rounded-full text-white ">
            <div> login</div>
          </button>
        </a>
      </nav>
    </header>
  );
};

export default Header;
