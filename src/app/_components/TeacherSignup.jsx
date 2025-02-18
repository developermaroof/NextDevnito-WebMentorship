import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const TeacherSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    address: "",
    contact: "",
  });
  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async () => {
    const { name, email, password, confirmPassword, city, address, contact } =
      formData;

    if (password !== confirmPassword) {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !city ||
      !address ||
      !contact
    ) {
      setError(true);
      return;
    } else {
      setError(false);
    }

    let response = await fetch("/api/teacher", {
      method: "POST",
      body: JSON.stringify({ name, email, password, city, address, contact }),
    });
    response = await response.json();
    if (response.success) {
      toast.success("Teacher SignedUp Successfully!");
      const { result } = response;
      delete result.password;
      localStorage.setItem("teacher", JSON.stringify(result));
      router.push("/teacher/dashboard");
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-6 md:mb-8 lg:mb-10">
        TEACHER SIGNUP
      </h1>
      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        {/* Name Input */}
        <div>
          <input
            className="w-full text-sm sm:text-base md:text-lg lg:text-xl lg:w-96 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
          />
          {error && !formData.name && (
            <p className="text-red-500 text-xs md:text-sm lg:text-base mt-1">
              Field is Required
            </p>
          )}
        </div>
        {/* Email Input */}
        <div>
          <input
            className="w-full text-sm sm:text-base md:text-lg lg:text-xl lg:w-96 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />
          {error && !formData.email && (
            <p className="text-red-500 text-xs md:text-sm lg:text-base mt-1">
              Field is Required
            </p>
          )}
        </div>
        {/* Password Input */}
        <div>
          <input
            className="w-full text-sm sm:text-base md:text-lg lg:text-xl border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && !formData.password && (
            <p className="text-red-500 text-xs md:text-sm lg:text-base mt-1">
              Field is Required
            </p>
          )}
          {passwordError && (
            <p className="text-red-500 text-xs md:text-sm lg:text-base mt-1">
              Password and Confirm Password should match
            </p>
          )}
        </div>
        {/* Confirm Password Input */}
        <div>
          <input
            className="w-full text-sm sm:text-base md:text-lg lg:text-xl lg:w-96 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {error && !formData.confirmPassword && (
            <p className="text-red-500 text-xs md:text-sm lg:text-base mt-1">
              Field is Required
            </p>
          )}
          {passwordError && (
            <p className="text-red-500 text-xs md:text-sm lg:text-base mt-1">
              Password and Confirm Password should match
            </p>
          )}
        </div>
        {/* City Input */}
        <div>
          <input
            className="w-full text-sm sm:text-base md:text-lg lg:text-xl lg:w-96 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
            type="text"
            name="city"
            placeholder="Enter City"
            value={formData.city}
            onChange={handleChange}
          />
          {error && !formData.city && (
            <p className="text-red-500 text-xs md:text-sm lg:text-base mt-1">
              Field is Required
            </p>
          )}
        </div>
        {/* Address Input */}
        <div>
          <input
            className="w-full text-sm sm:text-base md:text-lg lg:text-xl lg:w-96 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
            type="text"
            name="address"
            placeholder="Enter Address"
            value={formData.address}
            onChange={handleChange}
          />
          {error && !formData.address && (
            <p className="text-red-500 text-xs md:text-sm lg:text-base mt-1">
              Field is Required
            </p>
          )}
        </div>
        {/* Contact Input */}
        <div>
          <input
            className="w-full text-sm sm:text-base md:text-lg lg:text-xl lg:w-96 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
            type="tel"
            name="contact"
            placeholder="Enter Contact Number"
            value={formData.contact}
            onChange={handleChange}
          />
          {error && !formData.contact && (
            <p className="text-red-500 text-xs md:text-sm lg:text-base mt-1">
              Field is Required
            </p>
          )}
        </div>
        {/* Sign Up Button */}
        <div>
          <button
            className="w-full text-sm sm:text-base md:text-lg lg:text-xl lg:w-96 bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition"
            type="submit"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignup;
