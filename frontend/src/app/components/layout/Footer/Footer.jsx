import React from "react";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 mt-auto">
      <div className="max-w-7xl  mx-auto  grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        <div>
          <h3 className="text-lg font-semibold mb-3">About Us</h3>
          <p className="text-gray-400">
            Weave is dedicated to bringing high-quality products to your
            doorstep. Our mission is to combine style and simplicity through
            seamless online shopping.
          </p>
        </div>

        <div className="ml-12">
          <h3 className="text-lg  font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Shop
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Categories
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="ml-20">
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@weave.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91 98765 43210
            </li>
            <li className="text-gray-400">Mon - Fri: 9AM - 6PM</li>
          </ul>
        </div>

        {/* Social Media */}
        <div className=" ml-20">
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-gray-400 hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-500 text-xs px-4">
        &copy; {new Date().getFullYear()} Weave. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
