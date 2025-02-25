"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditRoadmap = () => {
  const [mounted, setMounted] = useState(false);
  const [formDetails, setFormDetails] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [error, setError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  // Load existing roadmap data and set mounted flag
  useEffect(() => {
    setMounted(true);
    loadRoadmap();
  }, []);

  // Cleanup blob URL on unmount or preview change
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Fetch roadmap data to populate the form
  const loadRoadmap = async () => {
    try {
      const response = await fetch(`/api/teacher/roadmaps/edit/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setFormDetails({
          title: data.result.title || "",
          description: data.result.description || "",
          file: null, // File starts as null; existing URL is handled via preview
        });
        if (data.result.file) {
          setPreviewUrl(data.result.file); // Set existing Cloudinary URL as preview
        }
      } else {
        toast.error("Failed to load roadmap data!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading roadmap data!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormDetails({
        ...formDetails,
        file: file,
      });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Upload file to Cloudinary and return URL and resource_type
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "nextjspreset");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    const json = await res.json();
    return {
      url: json.secure_url,
      resource_type: json.resource_type, // Capture resource_type (e.g., "image")
    };
  };

  const handleSubmit = async () => {
    if (!formDetails.title || !formDetails.description) {
      setError(true);
      return;
    } else {
      setError(false);
    }

    try {
      setLoading(true);
      const teacherData = JSON.parse(localStorage.getItem("teacher"));
      const teacher_id = teacherData?._id;

      // Upload file to Cloudinary if a new file is selected
      let uploadResult = null;
      if (formDetails.file) {
        uploadResult = await uploadToCloudinary(formDetails.file);
      }

      const formData = new FormData();
      formData.append("title", formDetails.title);
      formData.append("description", formDetails.description);
      formData.append("teacher_id", teacher_id);
      if (uploadResult) {
        formData.append("file", uploadResult.url);
        formData.append("resource_type", uploadResult.resource_type);
      } else if (previewUrl && !formDetails.file) {
        formData.append("file", previewUrl); // Preserve existing file URL if no new upload
        formData.append("resource_type", "image"); // Assume existing file is an image
      }

      const response = await fetch(`/api/teacher/roadmaps/edit/${params.id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Roadmap Updated Successfully!");
        router.push("/teacher/dashboard/roadmaps");
      } else {
        toast.error("Failed to update roadmap!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center p-2 py-4">
        <h1 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
          Edit Roadmap
        </h1>
        <button
          className={`text-xs lg:text-sm xl:text-base 2xl:text-lg px-4 lg:px-6 xl:px-8 py-2 lg:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span>Updating...</span>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
          ) : (
            "Update"
          )}
        </button>
      </div>

      <div className="p-2 py-4">
        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg p-2 max-w-[800px]">
            <label htmlFor="title" className="text-gray-600">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter Roadmap Title"
              className="w-full rounded-lg focus:outline-none text-sm"
              value={formDetails.title}
              onChange={(e) =>
                setFormDetails({ ...formDetails, title: e.target.value })
              }
            />
          </div>
          {error && !formDetails.title && (
            <span className="text-red-500">Required</span>
          )}

          <div className="border border-gray-300 rounded-lg p-2 max-w-[800px]">
            <label htmlFor="description" className="text-gray-600">
              Description
            </label>
            <textarea
              placeholder="Enter Roadmap Description"
              className="w-full rounded-lg focus:outline-none text-sm"
              value={formDetails.description}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  description: e.target.value,
                })
              }
            />
          </div>
          {error && !formDetails.description && (
            <span className="text-red-500">Required</span>
          )}

          <div className="border border-gray-300 rounded-lg p-2 max-w-[800px]">
            <label className="text-gray-600 block mb-2">Upload Thumbnail</label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="fileInput">
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-gray-600">
                  Drag and drop files here or{" "}
                  <span className="text-blue-600 font-medium">browse</span>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </label>
            {previewUrl && (
              <div className="relative mt-4 w-full max-w-xs">
                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setFormDetails({ ...formDetails, file: null });
                  }}
                  className="absolute top-1 right-1 bg-gray-200 rounded-full p-1 hover:bg-gray-300 z-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoadmap;
