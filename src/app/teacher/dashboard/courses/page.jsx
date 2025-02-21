"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";

const Courses = () => {
  const [courses, setCourses] = useState();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    const teacher_id = teacherData._id;
    let response = await fetch(`/api/teacher/courses/${teacher_id}`);
    response = await response.json();
    if (response.success) {
      setCourses(response.result);
    } else {
      toast.error("Failed to load courses!");
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      setLoading(true);
      let response = await fetch(`/api/teacher/courses/${id}`, {
        method: "DELETE",
      });
      response = await response.json();
      if (response.success) {
        toast.success("Course Deleted Successfully!");
        loadCourses();
      } else {
        toast.error("Failed to delete course!");
      }
    } catch (error) {
      toast.error("Failed to delete course!");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    router.push("/teacher/dashboard/courses/addcourse");
  };

  const handleMenuToggle = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
          Courses
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNavigate}
            className="text-xs lg:text-sm xl:text-base 2xl:text-lg px-3 lg:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Course
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
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
                d="M12 5h.01M12 12h.01M12 19h.01"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5a1 1 0 11-2 0 1 1 0 012 0zm0 7a1 1 0 11-2 0 1 1 0 012 0zm0 7a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {courses ? (
          courses.length > 0 ? (
            courses.map((item, index) => (
              <div key={index} className="relative border p-4 max-w-[300px]">
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-bold">{item.title}</h2>
                    <p>{item.description}</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => handleMenuToggle(index)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
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
                          d="M12 5h.01M12 12h.01M12 19h.01"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 5a1 1 0 11-2 0 1 1 0 012 0zm0 7a1 1 0 11-2 0 1 1 0 012 0zm0 7a1 1 0 11-2 0 1 1 0 012 0z"
                        />
                      </svg>
                    </button>
                    {/* Dropdown menu appears only for the course whose index matches openMenuIndex */}
                    {openMenuIndex === index && (
                      <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10">
                        <button
                          onClick={() =>
                            router.push(
                              `/teacher/dashboard/courses/${item._id}`
                            )
                          }
                          className="w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(item._id)}
                          className={`w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 ${
                            loading && "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <span>Deleting...</span>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            </div>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {item.file && (
                  <div className="mt-2">
                    {item.contentType &&
                    item.contentType.startsWith("image") ? (
                      <img
                        src={item.file} // Use the Cloudinary URL directly
                        alt={item.uploadTitle || "Course File"}
                        className="w-full h-auto object-cover rounded"
                      />
                    ) : (
                      <a
                        href={item.file} // Use the Cloudinary URL directly
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
          ) : (
            <div className="w-full text-center text-lg font-medium p-8">
              No courses found.
            </div>
          ) // Show 5 skeleton loaders while courses are undefined
        ) : (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border p-4 max-w-[300px]">
              <SkeletonTheme baseColor="#f5f5f5" highlightColor="#67a4e6">
                <Skeleton height={30} width={200} />
                <Skeleton count={3} />
              </SkeletonTheme>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;
