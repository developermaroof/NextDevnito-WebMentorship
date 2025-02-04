"use client";
import React, { useEffect, useState } from "react";
import TeacherLogin from "../_components/TeacherLogin";
import TeacherSignup from "../_components/TeacherSignup";
import { usePathname, useRouter } from "next/navigation";

const Teacher = () => {
  const [login, setLogin] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let data = localStorage.getItem("teacher");
    if (!data && pathname == "/teacher/dashboard") {
      router.push("/teacher");
    } else if (data && pathname == "/teacher") {
      router.push("/teacher/dashboard");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Teacher Login/SignUp Page</h1>
      {login ? <TeacherLogin /> : <TeacherSignup />}

      <button
        className="text-blue-500 rounded-lg px-4 py-2 mt-4"
        onClick={() => setLogin(!login)}
        type="button"
      >
        {login
          ? "Do not have an account? SignUp"
          : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default Teacher;
