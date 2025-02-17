"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditCourse = () => {
  const params = useParams();
  const router = useRouter();

  console.log("Course ID:", params.id);

  const [activeTab, setActiveTab] = useState("details");
  const [formDetails, setFormDetails] = useState({
    title: "",
    subtitle: "",
    description: "",
  });
  const [formResources, setFormResources] = useState({
    contentType: "",
    uploadTitle: "",
    uploadDescription: "",
    file: null,
  });
  const [formSeo, setFormSeo] = useState({
    ppt: "",
    seoDescription: "",
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    let response = await fetch(
      `http://localhost:3000/api/teacher/courses/edit/${params.id}`
    );
    response = await response.json();
    if (response.success) {
      console.log("response.result: ", response.result);
      setFormDetails({
        title: response.result.title,
        subtitle: response.result.subtitle,
        description: response.result.description,
      });
      setFormResources({
        contentType: response.result.contentType,
        uploadTitle: response.result.uploadTitle,
        uploadDescription: response.result.uploadDescription,
        file: null,
      });
      setFormSeo({
        ppt: response.result.ppt,
        seoDescription: response.result.seoDescription,
      });
    }
  };

  const handleEdit = async () => {
    if (
      !formDetails.title ||
      !formDetails.subtitle ||
      !formDetails.description ||
      !formResources.contentType ||
      !formResources.uploadTitle ||
      !formResources.uploadDescription ||
      !formSeo.ppt ||
      !formSeo.seoDescription
    ) {
      setError(true);
      return;
    } else {
      setError(false);
    }

    const formData = new FormData();
    formData.append("title", formDetails.title);
    formData.append("subtitle", formDetails.subtitle);
    formData.append("description", formDetails.description);
    formData.append("contentType", formResources.contentType);
    formData.append("uploadTitle", formResources.uploadTitle);
    formData.append("uploadDescription", formResources.uploadDescription);
    formData.append("ppt", formSeo.ppt);
    formData.append("seoDescription", formSeo.seoDescription);

    if (formResources.file && formResources.file instanceof File) {
      formData.append("file", formResources.file);
    }

    let response = await fetch(
      `http://localhost:3000/api/teacher/courses/edit/${params.id}`,
      {
        method: "PUT",
        body: formData,
      }
    );
    response = await response.json();
    if (response.success) {
      toast.success("Course Updated Successfully!");
      router.push("/teacher/dashboard/courses");
    } else {
      toast.error("Failed to update course!");
    }
  };
  return (
    <div>
      {/* Header section with a flex container for the title and action buttons */}
      <div className="flex justify-between items-center p-2 py-4">
        <h1 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
          Edit Course
        </h1>

        <button
          className="text-xs lg:text-sm xl:text-base 2xl:text-lg px-4 lg:px-6 xl:px-8 py-2 lg:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={handleEdit}
        >
          Update
        </button>
      </div>

      {/* Main content container with padding */}
      <div className="p-2 py-4">
        {/* Tab header section with three buttons for switching between tabs */}
        <div className="flex gap-2 mb-6 border-b-[1px] border-gray-300">
          {/* Details tab button: active styling if activeTab equals "details" */}
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "details"
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold text-sm lg:text-base xl:text-lg 2xl:text-xl"
                : "text-gray-500 hover:text-gray-600 font-semibold text-sm lg:text-base xl:text-lg 2xl:text-xl"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>

          {/* Resources tab button: active styling if activeTab equals "resources" */}
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "resources"
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold text-sm lg:text-base xl:text-lg 2xl:text-xl"
                : "text-gray-500 hover:text-gray-600 font-semibold text-sm lg:text-base xl:text-lg 2xl:text-xl"
            }`}
            onClick={() => setActiveTab("resources")}
          >
            Resources
          </button>

          {/* SEO tab button: active styling if activeTab equals "seo" */}
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "seo"
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold text-sm lg:text-base xl:text-lg 2xl:text-xl"
                : "text-gray-500 hover:text-gray-600 font-semibold text-sm lg:text-base xl:text-lg 2xl:text-xl"
            }`}
            onClick={() => setActiveTab("seo")}
          >
            SEO
          </button>
        </div>

        <div className="space-y-4">
          {/* Render the Details tab content if activeTab is "details" */}
          {activeTab === "details" && (
            <>
              {/* Header for the Details section */}
              <div className="flex flex-col">
                <h2 className="text-md lg:text-lg xl:text-xl 2xl:text-2xl font-semibold">
                  Course Details
                </h2>
                <p className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-500">
                  Enter the details for the course.
                </p>
              </div>

              {/* Form fields for course details with spacing and padding */}
              <div className="space-y-4 p-2">
                {/* Input container for the course title */}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Course Title"
                    className="w-full text-sm lg:text-base xl:text-lg 2xl:text-xl rounded-lg focus:outline-none"
                    value={formDetails.title}
                    onChange={(e) =>
                      // Update the formDetails state with the new title value
                      setFormDetails({ ...formDetails, title: e.target.value })
                    }
                  />
                </div>
                {/* Display error message if title is missing and error state is true */}
                {error && !formDetails.title && (
                  <span className="text-red-500">Required</span>
                )}

                {/* Input container for the course subtitle */}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600"
                    htmlFor="subtitle"
                  >
                    Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Course Subtitle"
                    className="w-full text-sm lg:text-base xl:text-lg 2xl:text-xl rounded-lg focus:outline-none"
                    value={formDetails.subtitle}
                    onChange={(e) =>
                      // Update the formDetails state with the new subtitle value
                      setFormDetails({
                        ...formDetails,
                        subtitle: e.target.value,
                      })
                    }
                  />
                </div>
                {/* Display error message if subtitle is missing and error state is true */}
                {error && !formDetails.subtitle && (
                  <span className="text-red-500">Required</span>
                )}

                {/* Input container for the course description */}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    placeholder="Enter Course Description"
                    className="w-full text-sm lg:text-base xl:text-lg 2xl:text-xl rounded-lg focus:outline-none"
                    value={formDetails.description}
                    onChange={(e) =>
                      // Update the formDetails state with the new description value
                      setFormDetails({
                        ...formDetails,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                {/* Display error message if description is missing and error state is true */}
                {error && !formDetails.description && (
                  <span className="text-red-500">Required</span>
                )}
              </div>
            </>
          )}

          {/* Render the Resources tab content if activeTab is "resources" */}
          {activeTab === "resources" && (
            <>
              {/* Header for the Resources section */}
              <div className="flex flex-col">
                <h2 className="text-md lg:text-lg xl:text-xl 2xl:text-2xl font-semibold">
                  Upload Notes
                </h2>
                <p className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-500">
                  Enter the details for the course.
                </p>
              </div>

              <div className="space-y-4 p-2">
                {/* Input container for content type */}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600"
                    htmlFor="contentType"
                  >
                    Content Type
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Content Type"
                    className="w-full text-sm lg:text-base xl:text-lg 2xl:text-xl rounded-lg focus:outline-none"
                    value={formResources.contentType}
                    onChange={(e) =>
                      // Update the formResources state with the new content type value
                      setFormResources({
                        ...formResources,
                        contentType: e.target.value,
                      })
                    }
                  />
                </div>
                {/* Display error message if content type is missing and error state is true */}
                {error && !formResources.contentType && (
                  <span className="text-red-500">Required</span>
                )}

                {/* Input container for resource title */}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600"
                    htmlFor="uploadTitle"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Content Title"
                    className="w-full text-sm lg:text-base xl:text-lg 2xl:text-xl rounded-lg focus:outline-none"
                    value={formResources.uploadTitle}
                    onChange={(e) =>
                      // Update the formResources state with the new upload title value
                      setFormResources({
                        ...formResources,
                        uploadTitle: e.target.value,
                      })
                    }
                  />
                </div>
                {/* Display error message if upload title is missing and error state is true */}
                {error && !formResources.uploadTitle && (
                  <span className="text-red-500">Required</span>
                )}

                {/* Input container for resource description */}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600"
                    htmlFor="uploadDescription"
                  >
                    Description
                  </label>
                  <textarea
                    placeholder="Enter Content Description"
                    className="w-full text-sm lg:text-base xl:text-lg 2xl:text-xl rounded-lg focus:outline-none"
                    value={formResources.uploadDescription}
                    onChange={(e) =>
                      // Update the formResources state with the new upload description value
                      setFormResources({
                        ...formResources,
                        uploadDescription: e.target.value,
                      })
                    }
                  />
                </div>
                {/* Display error message if upload description is missing and error state is true */}
                {error && !formResources.uploadDescription && (
                  <span className="text-red-500">Required</span>
                )}

                {/* Container for file upload input */}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600 block mb-2"
                    htmlFor="file"
                  >
                    Upload File
                  </label>
                  {/* Relative container to position the hidden file input */}
                  <div className="relative">
                    {/* Hidden file input overlayed over the styled div */}
                    <input
                      type="file"
                      id="file"
                      name="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        // Get the first selected file from the file input
                        const selectedFile = e.target.files[0];
                        // Update formResources state with the selected file and automatically set its MIME type
                        setFormResources({
                          ...formResources,
                          file: selectedFile,
                          contentType: selectedFile.type,
                        });
                      }}
                    />

                    {/* Styled container for drag and drop file upload UI */}
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                      {/* SVG icon for file upload */}
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
                      {/* Instructional text for file upload */}
                      <p className="text-gray-600">
                        Drag and drop files here or
                        <span className="text-blue-600 font-medium">
                          browse
                        </span>
                      </p>
                      {/* Information on supported file formats */}
                      <p className="text-sm text-gray-500 mt-2">
                        Supported formats: PDF, DOC, PPT
                      </p>
                    </div>
                    {/* If a file is selected, display its name */}
                    {formResources.file && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected file: {formResources.file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Render the SEO tab content if activeTab is "seo" */}
          {activeTab === "seo" && (
            <>
              {/* Header for the SEO section */}
              <div className="flex flex-col">
                <h2 className="text-md lg:text-lg xl:text-xl 2xl:text-2xl font-semibold">
                  SEO
                </h2>
                <p className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-500">
                  Enter the details for the course.
                </p>
              </div>

              <div className="space-y-4 p-2">
                {/* Input container for PPT Title */}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600"
                    htmlFor="ppt"
                  >
                    PPT Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter PPT Title"
                    className="w-full text-sm lg:text-base xl:text-lg 2xl:text-xl rounded-lg focus:outline-none"
                    value={formSeo.ppt}
                    onChange={(e) =>
                      // Update formSeo state with the new PPT title value
                      setFormSeo({
                        ...formSeo,
                        ppt: e.target.value,
                      })
                    }
                  />
                </div>
                {/* Display error message if PPT title is missing and error state is true */}
                {error && !formSeo.ppt && (
                  <span className="text-red-500">Required</span>
                )}

                {/* Input container for SEO Description */}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600"
                    htmlFor="seoDescription"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Enter PPT Description"
                    className="w-full text-sm lg:text-base xl:text-lg 2xl:text-xl rounded-lg focus:outline-none"
                    value={formSeo.seoDescription}
                    onChange={(e) =>
                      // Update formSeo state with the new SEO description value
                      setFormSeo({
                        ...formSeo,
                        seoDescription: e.target.value,
                      })
                    }
                  />
                </div>
                {/* Display error message if SEO description is missing and error state is true */}
                {error && !formSeo.seoDescription && (
                  <span className="text-red-500">Required</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
