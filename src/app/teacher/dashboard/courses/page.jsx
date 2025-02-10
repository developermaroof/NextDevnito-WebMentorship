"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const Courses = () => {
  const [courses, setCourses] = useState();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    const teacher_id = teacherData._id;
    let response = await fetch(
      `http://localhost:3000/api/teacher/courses/${teacher_id}`
    );
    response = await response.json();
    if (response.success) {
      setCourses(response.result);
    } else {
      alert("Failed to load courses!");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Courses</h1>
        <div className="flex items-center gap-2">
          <button className="text-xs px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Link href="/teacher/dashboard/courses/addcourse">Add Course</Link>
          </button>
          {/* Horizontal 3-dot menu icon */}
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
      <div className="flex flex-wrap gap-4">
        {courses &&
          courses.map((item, index) => (
            <div key={index} className="border p-4 max-w-[300px]">
              <h2 className="font-bold">{item.title}</h2>
              <p>{item.description}</p>
              {/* Show file if exists */}
              {item.file && (
                <div className="mt-2">
                  {/* If you saved images and stored the file name, assume files are in /uploads */}
                  {item.contentType && item.contentType.startsWith("image/") ? (
                    <img
                      src={`/uploads/${item.file}`}
                      alt={item.uploadTitle || "Course File"}
                      className="w-full h-auto object-cover rounded"
                    />
                  ) : (
                    <a
                      href={`/uploads/${item.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View File
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Courses;
