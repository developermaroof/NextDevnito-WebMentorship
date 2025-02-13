import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const TeacherSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");

  const router = useRouter();

  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSignUp = async () => {
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

    console.log(name, email, password, confirmPassword, city, address, contact);
    let response = await fetch("http://localhost:3000/api/teacher", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        city,
        address,
        contact,
      }),
    });
    response = await response.json();
    console.log(response);
    if (response.success) {
      toast.success("Teacher SignedUp Successfully!");
      const { result } = response;
      delete result.password;
      localStorage.setItem("teacher", JSON.stringify(result));
      router.push("/teacher/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">TeacherSignUp</h1>
      <div className=" flex flex-col gap-4 mt-4 items-center">
        <div>
          <input
            className="border-2 border-blue-500 rounded-lg px-4 py-2"
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && !name && (
            <span className="text-red-500 text-xs absolute p-[8px]">
              Field is Required
            </span>
          )}
        </div>
        <div>
          <input
            className="border-2 border-blue-500 rounded-lg px-4 py-2"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && !email && (
            <span className="text-red-500 text-xs absolute p-[8px]">
              Field is Required
            </span>
          )}
        </div>
        <div>
          <input
            className="border-2 border-blue-500 rounded-lg px-4 py-2"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && (
            <span className="text-red-500 text-xs absolute p-[8px]">
              Password and Confirm Password should be same
            </span>
          )}
          {error && !password && (
            <span className="text-red-500 text-xs absolute p-[8px]">
              Field is Required
            </span>
          )}
        </div>

        <div>
          <input
            className="border-2 border-blue-500 rounded-lg px-4 py-2"
            type="password"
            placeholder="Enter Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordError && (
            <span className="text-red-500 text-xs absolute p-[8px]">
              Password and Confirm Password should be same
            </span>
          )}
          {error && !confirmPassword && (
            <span className="text-red-500 text-xs absolute p-[8px]">
              Field is Required
            </span>
          )}
        </div>

        <div>
          <input
            className="border-2 border-blue-500 rounded-lg px-4 py-2"
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {error && !city && (
            <span className="text-red-500 text-xs absolute p-[8px]">
              Field is Required
            </span>
          )}
        </div>
        <div>
          <input
            className="border-2 border-blue-500 rounded-lg px-4 py-2"
            type="text"
            placeholder="Enter Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {error && !address && (
            <span className="text-red-500 text-xs absolute p-[8px]">
              Field is Required
            </span>
          )}
        </div>
        <div>
          <input
            className="border-2 border-blue-500 rounded-lg px-4 py-2"
            type="tel"
            placeholder="Enter Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          {error && !contact && (
            <span className="text-red-500 text-xs absolute p-[8px]">
              Field is Required
            </span>
          )}
        </div>
        <div>
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 w-[100px]"
            type="submit"
            onClick={handleSignUp}
          >
            SignUp
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignup;
