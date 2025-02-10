"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Courses = () => {
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
    let teacher_id;
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    if (teacherData) {
      teacher_id = teacherData._id;
    }
    // Create a FormData instance
    const formData = new FormData();
    formData.append("title", formDetails.title);
    formData.append("subtitle", formDetails.subtitle);
    formData.append("description", formDetails.description);
    formData.append("contentType", formResources.contentType);
    formData.append("uploadTitle", formResources.uploadTitle);
    formData.append("uploadDescription", formResources.uploadDescription);
    formData.append("ppt", formSeo.ppt);
    formData.append("seoDescription", formSeo.seoDescription);
    formData.append("teacher_id", teacher_id);

    // Append the file if it exists
    if (formResources.file) {
      formData.append("file", formResources.file);
    }

    // Note: Do not set the Content-Type header manually;
    // the browser will set it including the proper boundary.
    let response = await fetch("http://localhost:3000/api/teacher/courses", {
      method: "POST",
      body: formData,
    });

    response = await response.json();
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
      <div className="flex justify-between items-center p-2 py-4">
        <h1 className="text-xl font-bold">Courses</h1>
        <div className="flex items-center gap-[4px]">
          <button className="text-xs px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Delete
          </button>
          <button className="text-xs px-3 py-2 border-[1px] text-black rounded-lg hover:text-white hover:bg-gray-600">
            Draft
          </button>
          <button
            className="text-xs px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="p-2 py-4">
        <div className="flex gap-2 mb-6 border-b-[1px] border-gray-300">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "details"
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold text-sm"
                : "text-gray-500 hover:text-gray-600 font-semibold text-sm"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "resources"
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold text-sm"
                : "text-gray-500 hover:text-gray-600 font-semibold text-sm"
            }`}
            onClick={() => setActiveTab("resources")}
          >
            Resources
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "seo"
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold text-sm"
                : "text-gray-500 hover:text-gray-600 font-semibold text-sm"
            }`}
            onClick={() => setActiveTab("seo")}
          >
            SEO
          </button>
        </div>

        <div className="space-y-4">
          {/* Details Tab Content */}
          {activeTab === "details" && (
            <>
              <div className="flex flex-col">
                <h2 className="text-md font-semibold">Course Details</h2>
                <p className="text-sm text-gray-500">
                  Enter the details for the course.
                </p>
              </div>

              <div className="space-y-4 p-2">
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label className="text-sm text-gray-600" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Course Title"
                    className="w-full text-sm rounded-lg focus:outline-none"
                    value={formDetails.title}
                    onChange={(e) =>
                      setFormDetails({ ...formDetails, title: e.target.value })
                    }
                  />
                </div>
                {error && !formDetails.title && (
                  <span className="text-red-500">Required</span>
                )}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label className="text-sm text-gray-600" htmlFor="subtitle">
                    Subtitle{" "}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Course Subtitle"
                    className="w-full text-sm rounded-lg focus:outline-none"
                    value={formDetails.subtitle}
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        subtitle: e.target.value,
                      })
                    }
                  />
                </div>
                {error && !formDetails.subtitle && (
                  <span className="text-red-500">Required</span>
                )}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm text-gray-600"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    placeholder="Enter Course Description"
                    className="w-full text-sm rounded-lg focus:outline-none"
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
              </div>
            </>
          )}

          {/* Resources Tab Content */}
          {activeTab === "resources" && (
            <>
              <div className="flex flex-col">
                <h2 className="text-md font-semibold">Upload Notes</h2>
                <p className="text-sm text-gray-500">
                  Enter the details for the course.
                </p>
              </div>

              <div className="space-y-4 p-2">
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm text-gray-600"
                    htmlFor="contentType"
                  >
                    Content Type
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Content Type"
                    className="w-full text-sm rounded-lg focus:outline-none"
                    value={formResources.contentType}
                    onChange={(e) =>
                      setFormResources({
                        ...formResources,
                        contentType: e.target.value,
                      })
                    }
                  />
                </div>
                {error && !formResources.contentType && (
                  <span className="text-red-500">Required</span>
                )}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm text-gray-600"
                    htmlFor="uploadTitle"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Content Title"
                    className="w-full text-sm rounded-lg focus:outline-none"
                    value={formResources.uploadTitle}
                    onChange={(e) =>
                      setFormResources({
                        ...formResources,
                        uploadTitle: e.target.value,
                      })
                    }
                  />
                </div>
                {error && !formResources.uploadTitle && (
                  <span className="text-red-500">Required</span>
                )}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm text-gray-600"
                    htmlFor="uploadDescription"
                  >
                    Description
                  </label>
                  <textarea
                    placeholder="Enter Content Description"
                    className="w-full text-sm rounded-lg focus:outline-none"
                    value={formResources.uploadDescription}
                    onChange={(e) =>
                      setFormResources({
                        ...formResources,
                        uploadDescription: e.target.value,
                      })
                    }
                  />
                </div>
                {error && !formResources.uploadDescription && (
                  <span className="text-red-500">Required</span>
                )}
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm text-gray-600 block mb-2"
                    htmlFor="file"
                  >
                    Upload File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="file"
                      name="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        setFormResources({
                          ...formResources,
                          file: selectedFile,
                          contentType: selectedFile.type, // auto-set the MIME type
                        });
                      }}
                    />

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
                        Drag and drop files here or
                        <span className="text-blue-600 font-medium">
                          browse
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Supported formats: PDF, DOC, PPT
                      </p>
                    </div>
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

          {/* SEO Tab Content */}
          {activeTab === "seo" && (
            <>
              <div className="flex flex-col">
                <h2 className="text-md font-semibold">SEO</h2>
                <p className="text-sm text-gray-500">
                  Enter the details for the course.
                </p>
              </div>

              <div className="space-y-4 p-2">
                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label className="text-sm text-gray-600" htmlFor="ppt">
                    PPT Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter PPT Title"
                    className="w-full text-sm rounded-lg focus:outline-none"
                    value={formSeo.ppt}
                    onChange={(e) =>
                      setFormSeo({
                        ...formSeo,
                        ppt: e.target.value,
                      })
                    }
                  />
                </div>
                {error && !formSeo.ppt && (
                  <span className="text-red-500">Required</span>
                )}

                <div className="border-[1px] border-gray-300 rounded-lg p-2 max-w-[800px]">
                  <label
                    className="text-sm text-gray-600"
                    htmlFor="seoDescription"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Enter PPT Description"
                    className="w-full text-sm rounded-lg focus:outline-none"
                    value={formSeo.seoDescription}
                    onChange={(e) =>
                      setFormSeo({
                        ...formSeo,
                        seoDescription: e.target.value,
                      })
                    }
                  />
                </div>
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
