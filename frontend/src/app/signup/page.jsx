"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const Signup = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z ]+$/.test(form.name.trim())) {
      newErrors.name = "Name should contain only alphabets";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    ) {
      newErrors.email = "Invalid email format";
    }

    // if (form.phone && !/^[0-9]{10,15}$/.test(form.phone.trim())) {
    //   newErrors.phone = "Phone must be 10 to 15 digits";
    // }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        form.password
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );
      console.log(response);
      console.log("Submitting:", form);
      toast.success("Signup Successful");
      // router.push("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogleSignup = () => {
    alert("Redirecting to Google signup...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-2 sm:px-4 py-6">
      <div className="w-full max-w-sm sm:max-w-md border border-black p-6 sm:p-8 rounded-2xl shadow-2xl relative bg-white">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-3 left-3 text-gray-500 hover:text-black"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl font-semibold mb-5 text-center">
          Sign Up
        </h2>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 border border-black py-2 rounded-lg mb-5 text-sm hover:bg-black hover:text-white transition"
        >
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </button>

        <div className="border-t border-gray-300 mb-5" />

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-black px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="h-[1.25rem]">
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-black px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="h-[1.25rem]">
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          {/* <div>
            <label className="block mb-1 font-medium">Phone (Optional)</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-black px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="h-[1.25rem]">
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>
          </div> */}

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-black px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-xs text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            <div className="h-[1.25rem]">
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Sign Up
          </button>

          {/* Link to Login */}
          <p className="text-xs text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="underline hover:text-blue-600">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
