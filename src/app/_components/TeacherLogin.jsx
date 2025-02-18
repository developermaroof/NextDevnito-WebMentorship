import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError(true);
      return;
    } else {
      setError(false);
    }

    let response = await fetch("/api/teacher", {
      method: "POST",
      body: JSON.stringify({
        login: true,
        email,
        password,
      }),
    });
    response = await response.json();
    if (response.success) {
      const { result } = response;
      delete result.password;
      localStorage.setItem("teacher", JSON.stringify(result));
      toast.success("Teacher Logged In Successfully!");
      router.push("/teacher/dashboard");
    } else {
      toast.error("Invalid Email or Password!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-6 md:mb-8 lg:mb-10">
        TEACHER LOGIN
      </h1>
      <div className="space-y-4 md:space-y-5 lg:space-y-6">
        <div>
          <input
            className="w-full text-sm sm:text-base md:text-lg lg:text-xl lg:w-96 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && !email && (
            <p className="text-red-500 text-xs md:text-sm lg:text-base mt-1">
              Email is Required
            </p>
          )}
        </div>
        <div>
          <input
            className="w-full text-sm sm:text-base md:text-lg lg:text-xl lg:w-96 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && !password && (
            <p className="text-red-500 text-xs md:text-sm lg:text-base mt-1">
              Password is Required
            </p>
          )}
        </div>
        <div>
          <button
            className="w-full text-sm sm:text-base md:text-lg lg:text-xl lg:w-96 bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition"
            type="submit"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
