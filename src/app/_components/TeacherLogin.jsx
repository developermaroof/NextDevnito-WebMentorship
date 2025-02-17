import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    console.log(email, password);
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
      <h1 className="text-2xl font-bold">TeacherLogin</h1>
      <div className=" flex flex-col gap-4 mt-4 items-center">
        <div>
          <input
            className="border-2 border-blue-500 rounded-lg px-4 py-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && !email && (
            <span className="text-red-500 text-xs absolute p-[8px]">
              Email is Required
            </span>
          )}
        </div>
        <div>
          <input
            className="border-2 border-blue-500 rounded-lg px-4 py-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && !password && (
            <span className="text-red-500 text-xs absolute p-[8px]">
              Password is Required
            </span>
          )}
        </div>
        <div>
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 w-[100px]"
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
