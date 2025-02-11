"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Courses = () => {
  // Declare a state variable "activeTab" to manage which tab is active, defaulting to "details"
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
    file: {},
  });
  const [formSeo, setFormSeo] = useState({
    ppt: "",
    seoDescription: "",
  });
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    // Check if any required fields in formDetails, formResources, or formSeo are empty
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
      // If any required field is missing, set the error state to true and exit the function
      setError(true);
      return;
    } else {
      // Otherwise, clear any previous error indication
      setError(false);
    }
    // Initialize a variable for teacher_id
    let teacher_id;
    // Retrieve teacher data stored in localStorage and parse it from JSON
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    // If teacherData exists, extract the teacher's _id property
    if (teacherData) {
      teacher_id = teacherData._id;
    }
    // Create a new FormData instance to hold form data for a POST request
    const formData = new FormData();
    // Append course details to the form data
    formData.append("title", formDetails.title);
    formData.append("subtitle", formDetails.subtitle);
    formData.append("description", formDetails.description);
    // Append resource details to the form data
    formData.append("contentType", formResources.contentType);
    formData.append("uploadTitle", formResources.uploadTitle);
    formData.append("uploadDescription", formResources.uploadDescription);
    // Append SEO details to the form data
    formData.append("ppt", formSeo.ppt);
    formData.append("seoDescription", formSeo.seoDescription);
    // Append the teacher ID to the form data
    formData.append("teacher_id", teacher_id);

    // If a file has been selected, append it to the form data
    if (formResources.file) {
      formData.append("file", formResources.file);
    }

    // Note: The browser automatically sets the Content-Type header for FormData with the proper boundary

    // Send a POST request to the API endpoint with the form data
    let response = await fetch("http://localhost:3000/api/teacher/courses", {
      method: "POST",
      body: formData,
    });

    // Parse the response JSON
    response = await response.json();
    // If the response indicates success
    if (response.success) {
      console.log(response);
      alert("Course Created Successfully!");
      router.push("/teacher/dashboard/courses");
    } else {
      alert("Failed to create course!");
    }
  };

  return (
    <div>
      {/* Header section with a flex container for the title and action buttons */}
      <div className="flex justify-between items-center p-2 py-4">
        <h1 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
          Courses
        </h1>
        <div className="flex items-center gap-[4px] lg:gap-4">
          <button className="text-xs lg:text-sm xl:text-base 2xl:text-lg px-3 lg:px-4 xl:px-6 2xl:px-8 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Delete
          </button>
          <button className="text-xs lg:text-sm xl:text-base 2xl:text-lg px-3 lg:px-4 xl:px-6 2xl:px-8 py-2 border-[1px] text-black rounded-lg hover:text-white hover:bg-gray-600">
            Draft
          </button>
          <button
            className="text-xs lg:text-sm xl:text-base 2xl:text-lg px-3 lg:px-4 xl:px-6 2xl:px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
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

export default Courses;
