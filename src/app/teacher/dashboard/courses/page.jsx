"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
      toast.error("Failed to load courses!");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
          Courses
        </h1>
        <div className="flex items-center gap-2">
          <button className="text-xs lg:text-sm xl:text-base 2xl:text-lg px-3 lg:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Link href="/teacher/dashboard/courses/addcourse">Add Course</Link>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            {/* SVG icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 lg:h-6 xl:h-7 2xl:h-8 w-5 lg:w-6 xl:w-7 2xl:w-8"
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
        {courses
          ? courses.map((item, index) => (
              <div key={index} className="border p-4 max-w-[300px]">
                <h2 className="font-bold">{item.title}</h2>
                <p>{item.description}</p>

                {item.file && (
                  <div className="mt-2">
                    {item.contentType &&
                    item.contentType.startsWith("image/") ? (
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
            ))
          : // Show 5 skeleton loaders while courses are undefined
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border p-4 max-w-[300px]">
                <SkeletonTheme baseColor="#f5f5f5" highlightColor="#67a4e6">
                  <Skeleton height={30} width={200} />
                  <Skeleton count={3} />
                </SkeletonTheme>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Courses;
