"use client";
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
    file: "",
  });
  const [formSeo, setFormSeo] = useState({
    ppt: "",
    seoDescription: "",
  });

  const handleSubmit = async () => {
    // Combine all form data
    const formData = {
      ...formDetails,
      ...formResources,
      ...formSeo,
    };

    const {
      title,
      subtitle,
      description,
      contentType,
      uploadTitle,
      uploadDescription,
      ppt,
      seoDescription,
    } = formData;

    console.log(formData);

    let teacher_id;
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    if (teacherData) {
      teacher_id = teacherData._id;
    }
    let response = await fetch("http://localhost:3000/api/teacher/courses", {
      method: "POST",
      body: JSON.stringify({
        title,
        subtitle,
        description,
        contentType,
        uploadTitle,
        uploadDescription,
        ppt,
        seoDescription,
        teacher_id,
      }),
    });
    response = await response.json();
    if (response.success) {
      console.log(response);
    }
  };

  return (
    <div className="border-[1px] border-red-500">
      <div className="flex justify-between items-center p-4 border-[1px] border-blue-500">
        <h1 className="text-2xl font-bold">Courses</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Delete
          </button>
          <button className="px-4 py-2 bg-white text-black border-[1px] rounded-lg  hover:bg-gray-500 hover:text-white">
            Move to Draft
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "details"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "resources"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("resources")}
          >
            Resources
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "seo"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
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
              <div className="border-[1px] border-red-300">
                <h2>Course Details</h2>
                <p>Enter the details for the course.</p>
              </div>

              <div className="space-y-4 border-[1px] border-red-300">
                <div>
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    placeholder="Course Title"
                    className="w-full p-2 border rounded-lg"
                    value={formDetails.title}
                    onChange={(e) =>
                      setFormDetails({ ...formDetails, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="subtitle">Subtitle </label>
                  <input
                    type="text"
                    placeholder="Course Subtitle"
                    className="w-full p-2 border rounded-lg"
                    value={formDetails.subtitle}
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        subtitle: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="description">Description</label>
                  <textarea
                    placeholder="Course Description"
                    className="w-full p-2 border rounded-lg"
                    value={formDetails.description}
                    onChange={(e) =>
                      setFormDetails({
                        ...formDetails,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </>
          )}

          {/* Resources Tab Content */}
          {activeTab === "resources" && (
            <>
              <div className="border-[1px] border-red-300">
                <h2>Upload Notes</h2>
                <p>Enter the details for the course.</p>
              </div>

              <div className="space-y-4 border-[1px] border-red-300">
                <div>
                  <label htmlFor="contentType">Content Type</label>
                  <input
                    type="text"
                    placeholder="Course ContentType"
                    className="w-full p-2 border rounded-lg"
                    value={formResources.contentType}
                    onChange={(e) =>
                      setFormResources({
                        ...formResources,
                        contentType: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="uploadTitle">Title</label>
                  <input
                    type="text"
                    placeholder="Course UploadTitle"
                    className="w-full p-2 border rounded-lg"
                    value={formResources.uploadTitle}
                    onChange={(e) =>
                      setFormResources({
                        ...formResources,
                        uploadTitle: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="uploadDescription">Description</label>
                  <textarea
                    placeholder="Course UploadDescription"
                    className="w-full p-2 border rounded-lg"
                    value={formResources.uploadDescription}
                    onChange={(e) =>
                      setFormResources({
                        ...formResources,
                        uploadDescription: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="file" className="block mb-2">
                    Upload File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) =>
                        setFormResources({
                          ...formResources,
                          file: e.target.files[0],
                        })
                      }
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
              <div className="border-[1px] border-red-300">
                <h2>SEO</h2>
                <p>Enter the details for the course.</p>
              </div>

              <div className="space-y-4 border-[1px] border-red-300">
                <div>
                  <label htmlFor="ppt">PPT Title</label>
                  <input
                    type="text"
                    placeholder="Course ppt"
                    className="w-full p-2 border rounded-lg"
                    value={formSeo.ppt}
                    onChange={(e) =>
                      setFormSeo({
                        ...formSeo,
                        ppt: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="seoDescription">Description</label>
                  <input
                    type="text"
                    placeholder="Course seoDescription"
                    className="w-full p-2 border rounded-lg"
                    value={formSeo.seoDescription}
                    onChange={(e) =>
                      setFormSeo({
                        ...formSeo,
                        seoDescription: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
