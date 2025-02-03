import React from "react";

const TeacherLogin = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">TeacherLogin</h1>
      <div className=" flex flex-col gap-4 mt-4 items-center">
        <div>
          <input
            className="border-2 border-blue-500 rounded-lg px-4 py-2"
            type="email"
            placeholder="Email"
          />
        </div>
        <div>
          <input
            className="border-2 border-blue-500 rounded-lg px-4 py-2"
            type="password"
            placeholder="Password"
          />
        </div>
        <div>
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 w-[100px]"
            type="submit"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
