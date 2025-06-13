import React from "react";

const Header = () => {
  return (
    <header className="w-full shadow-md py-4 px-8 flex justify-between items-center bg-white">
      <h1 className="text-2xl font-bold">Weave</h1>
      <nav className="space-x-6">
        <a href="#" className="hover:text-blue-600">
          Home
        </a>
        <a href="#" className="hover:text-blue-600">
          Shop
        </a>
        <a href="#" className="hover:text-blue-600">
          Contact
        </a>
      </nav>
    </header>
  );
};

export default Header;
