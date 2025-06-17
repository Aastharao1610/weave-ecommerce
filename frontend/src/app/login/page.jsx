"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [step, setStep] = useState(1);
  const [isEmail, setIsEmail] = useState(null);
  const [password, setPassword] = useState("");
  // const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Step 1 validation for email
  const validateInput = () => {
    const emailRegex = /\S+@\S+\.\S+/;

    if (!input.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (emailRegex.test(input)) {
      setErrors({});
      setIsEmail(true);
      setStep(2);
    } else {
      setErrors({ email: "Enter a valid email address" });
    }
  };

  // Final login validation
  const handleLogin = async (e) => {
    e.preventDefault();

    const emailRegex = /\S+@\S+\.\S+/;
    let newErrors = {};

    if (!input.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(input)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: input,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const { user } = response.data;

      toast.success("login Successful");
      if (user.role === "User") {
        router.push("/");
      } else {
        router.push("/admin/dashboard");
      }
      // Redirect to dashboard/home
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Redirecting to Google login...");
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

        <h2 className="text-xl sm:text-2xl font-semibold mb-5 text-center">
          Login
        </h2>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-black py-2 rounded-lg mb-5 text-sm hover:bg-black hover:text-white transition"
        >
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </button>

        <div className="border-t border-gray-300 mb-5" />

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="space-y-4 text-sm">
            <input
              type="text"
              placeholder="Enter your email"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border border-black px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="h-[1.25rem]">
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            <button
              onClick={validateInput}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Password */}
        {step === 2 && isEmail && (
          <form onSubmit={handleLogin} className="space-y-4 text-sm">
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-black px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
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

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setIsEmail(null);
                setPassword("");
                setErrors({});
              }}
              className="w-full text-xs text-gray-600 underline hover:text-black mt-2"
            >
              Back
            </button>
          </form>
        )}

        <p className="text-xs text-center mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="underline hover:text-blue-600">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
