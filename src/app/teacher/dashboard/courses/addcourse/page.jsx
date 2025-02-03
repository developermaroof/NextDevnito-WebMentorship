import Link from "next/link";
import React from "react";

const Courses = () => {
  return (
    <div className="border-[1px] border-red-500">
      <div className="flex justify-between items-center p-4 border-[1px] border-blue-500">
        <h1 className="text-2xl font-bold">Courses</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Link href="/teacher/dashboard/courses/addcourse">Add Course</Link>
          </button>
          {/* Horizontal 3-dot menu icon */}
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h.01M12 12h.01M19 12h.01"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div>
        <div>navigations (Details, Resources, SEO)</div>
        <div>Chapter details</div>
      </div>
    </div>
  );
};

export default Courses;
