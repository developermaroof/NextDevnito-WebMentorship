"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";

const Roadmaps = () => {
  const [roadmaps, setRoadmaps] = useState();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // Per-roadmap loading state
  const router = useRouter();

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    const teacher_id = teacherData._id;
    let response = await fetch(`/api/teacher/roadmaps/${teacher_id}`);
    response = await response.json();
    if (response.success) {
      setRoadmaps(response.result);
    } else {
      toast.error("Failed to load roadmaps!");
    }
  };

  const handleDeleteRoadmap = async (id) => {
    try {
      setDeletingId(id); // Set the specific roadmap being deleted
      let response = await fetch(`/api/teacher/roadmaps/${id}`, {
        method: "DELETE",
      });
      response = await response.json();
      if (response.success) {
        toast.success("Roadmap Deleted Successfully!");
        loadRoadmaps();
      } else {
        toast.error("Failed to delete roadmap!");
      }
    } catch (error) {
      toast.error("Failed to delete roadmap!");
    } finally {
      setDeletingId(null);
    }
  };

  const handleNavigate = () => {
    router.push("/teacher/dashboard/roadmaps/addroadmap");
  };

  const handleMenuToggle = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
          Roadmaps
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNavigate}
            className="text-xs lg:text-sm xl:text-base 2xl:text-lg px-3 lg:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Roadmap
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
        {roadmaps ? (
          roadmaps.length > 0 ? (
            roadmaps.map((item, index) => (
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
                    {openMenuIndex === index && (
                      <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10">
                        <button
                          onClick={() =>
                            router.push(
                              `/teacher/dashboard/roadmaps/${item._id}`
                            )
                          }
                          className="w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRoadmap(item._id)}
                          className={`w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 ${
                            deletingId === item._id &&
                            "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {deletingId === item._id ? (
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
                    {/* Check if resource_type is "image" to display as thumbnail */}
                    {item.resource_type === "image" ? (
                      <div className="w-32 h-32">
                        {/* Use Cloudinary transformation for 128x128 thumbnail */}
                        <img
                          src={item.file.replace(
                            "/upload/",
                            "/upload/w_128,h_128,c_fill/"
                          )}
                          alt={item.title || "Roadmap Thumbnail"}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ) : (
                      <a
                        href={item.file}
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
              No roadmaps found.
            </div>
          )
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

export default Roadmaps;
