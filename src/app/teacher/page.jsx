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
    const data = localStorage.getItem("teacher");
    if (!data && pathname === "/teacher/dashboard/roadmaps") {
      router.push("/teacher");
    } else if (data && pathname === "/teacher") {
      router.push("/teacher/dashboard/roadmaps");
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 flex flex-col items-center justify-center px-4">
      <div className="p-8 sm:p-12 md:p-16 lg:p-20 bg-white rounded-2xl shadow-2xl">
        {login ? <TeacherLogin /> : <TeacherSignup />}
        <button
          className="text-xs sm:text-sm md:text-base lg:text-lg mt-4 text-blue-500 hover:underline"
          onClick={() => setLogin(!login)}
          type="button"
        >
          {login
            ? "Don't have an account? Sign Up"
            : "Already have an account? Log In"}
        </button>
      </div>
    </div>
  );
};

export default Teacher;
