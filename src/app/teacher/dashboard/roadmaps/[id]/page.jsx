"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const EditRoadmap = () => {
  const [mounted, setMounted] = useState(false);
  const [formDetails, setFormDetails] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideoIndex, setEditingVideoIndex] = useState(null);
  const [newVideo, setNewVideo] = useState({
    title: "",
    channelName: "",
    youtubeUrl: "",
    languages: "",
    skills: "",
    thumbnailFile: null,
    thumbnailPreviewUrl: null,
  });
  const [isLoading, setIsLoading] = useState(true); // New loading state for data fetching
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    setMounted(true);
    loadRoadmap();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      videos.forEach((video) => {
        if (
          video.thumbnailPreviewUrl &&
          video.thumbnailPreviewUrl.startsWith("blob:")
        ) {
          URL.revokeObjectURL(video.thumbnailPreviewUrl);
        }
      });
    };
  }, [previewUrl, videos]);

  const loadRoadmap = async () => {
    try {
      setIsLoading(true); // Start loading
      const response = await fetch(`/api/teacher/roadmaps/edit/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setFormDetails({
          title: data.result.title || "",
          description: data.result.description || "",
          file: null,
        });
        if (data.result.file) {
          setPreviewUrl(data.result.file);
        }
        setVideos(
          data.result.videos?.map((video) => ({
            ...video,
            thumbnailPreviewUrl: video.channelThumbnail,
            thumbnailFile: null,
          })) || []
        );
      } else {
        toast.error("Failed to load roadmap data!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading roadmap data!");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormDetails({ ...formDetails, file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "nextjspreset");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      { method: "POST", body: data }
    );
    const json = await res.json();
    return { url: json.secure_url, resource_type: json.resource_type };
  };

  const handleAddVideo = () => {
    setEditingVideoIndex(null);
    setNewVideo({
      title: "",
      channelName: "",
      youtubeUrl: "",
      languages: "",
      skills: "",
      thumbnailFile: null,
      thumbnailPreviewUrl: null,
    });
    setIsModalOpen(true);
  };

  const handleEditVideo = (index) => {
    const video = videos[index];
    setEditingVideoIndex(index);
    setNewVideo({
      title: video.title,
      channelName: video.channelName,
      youtubeUrl: video.youtubeUrl,
      languages: video.languages.join(", "),
      skills: video.skills.join(", "),
      thumbnailFile: null,
      thumbnailPreviewUrl: video.channelThumbnail,
    });
    setIsModalOpen(true);
  };

  const handleDeleteVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleSaveVideo = () => {
    if (!newVideo.title || !newVideo.youtubeUrl) {
      toast.error("Video title and YouTube URL are required!");
      return;
    }

    const languagesArray = newVideo.languages
      .split(",")
      .map((lang) => lang.trim())
      .filter(Boolean);
    const skillsArray = newVideo.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const updatedVideo = {
      title: newVideo.title,
      channelName: newVideo.channelName,
      youtubeUrl: newVideo.youtubeUrl,
      languages: languagesArray,
      skills: skillsArray,
      channelThumbnail:
        editingVideoIndex !== null
          ? videos[editingVideoIndex].channelThumbnail
          : "",
      thumbnailFile: newVideo.thumbnailFile,
      thumbnailPreviewUrl: newVideo.thumbnailPreviewUrl,
    };

    if (editingVideoIndex !== null) {
      setVideos(
        videos.map((v, i) => (i === editingVideoIndex ? updatedVideo : v))
      );
    } else {
      setVideos([...videos, updatedVideo]);
    }
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!formDetails.title || !formDetails.description) {
      setError(true);
      return;
    }
    setError(false);

    try {
      setLoading(true);
      const teacherData = JSON.parse(localStorage.getItem("teacher"));
      const teacher_id = teacherData?._id;

      let roadmapThumbnailUrl = previewUrl;
      let roadmapResourceType = "image";
      if (formDetails.file) {
        const uploadResult = await uploadToCloudinary(formDetails.file);
        roadmapThumbnailUrl = uploadResult.url;
        roadmapResourceType = uploadResult.resource_type;
      }

      const uploadedVideos = await Promise.all(
        videos.map(async (video) => {
          if (video.thumbnailFile) {
            const uploadResult = await uploadToCloudinary(video.thumbnailFile);
            return { ...video, channelThumbnail: uploadResult.url };
          }
          return video;
        })
      );

      const videosForApi = uploadedVideos.map((video) => ({
        title: video.title,
        channelName: video.channelName,
        youtubeUrl: video.youtubeUrl,
        languages: video.languages,
        skills: video.skills,
        channelThumbnail: video.channelThumbnail,
      }));

      const formData = new FormData();
      formData.append("title", formDetails.title);
      formData.append("description", formDetails.description);
      formData.append("teacher_id", teacher_id);
      if (roadmapThumbnailUrl) {
        formData.append("file", roadmapThumbnailUrl);
        formData.append("resource_type", roadmapResourceType);
      }
      formData.append("videos", JSON.stringify(videosForApi));

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
            loading || isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmit}
          disabled={loading || isLoading}
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
          {isLoading ? (
            <SkeletonTheme baseColor="#f5f5f5" highlightColor="#e0e0e0">
              {/* Skeleton for Title */}
              <div className="border border-gray-300 rounded-lg p-2 max-w-[800px]">
                <Skeleton height={20} width={100} />
                <Skeleton height={40} />
              </div>
              {/* Skeleton for Description */}
              <div className="border border-gray-300 rounded-lg p-2 max-w-[800px]">
                <Skeleton height={20} width={100} />
                <Skeleton height={100} />
              </div>
              {/* Skeleton for Thumbnail */}
              <div className="border border-gray-300 rounded-lg p-2 max-w-[800px]">
                <Skeleton height={20} width={100} />
                <Skeleton height={200} />
              </div>
              {/* Skeleton for Videos Section */}
              <div className="border border-gray-300 rounded-lg p-2 max-w-[800px]">
                <Skeleton height={20} width={100} />
                <Skeleton count={2} height={40} />
              </div>
            </SkeletonTheme>
          ) : (
            <>
              {/* Title */}
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

              {/* Description */}
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

              {/* Thumbnail */}
              <div className="border border-gray-300 rounded-lg p-2 max-w-[800px]">
                <label className="text-gray-600 block mb-2">
                  Upload Thumbnail
                </label>
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

              {/* Videos Section */}
              <div className="border border-gray-300 rounded-lg p-2 max-w-[800px]">
                <h2 className="text-lg font-semibold mb-2">Videos</h2>
                <div className="space-y-2">
                  {videos.map((video, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-100 rounded-lg"
                    >
                      <span>{video.title}</span>
                      <div>
                        <button
                          onClick={() => handleEditVideo(index)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddVideo}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Video
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingVideoIndex !== null ? "Edit Video" : "Add Video"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-600">Title</label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, title: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                  placeholder="Enter video title"
                />
              </div>
              <div>
                <label className="text-gray-600">Channel Name</label>
                <input
                  type="text"
                  value={newVideo.channelName}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, channelName: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                  placeholder="Enter channel name"
                />
              </div>
              <div>
                <label className="text-gray-600">YouTube URL</label>
                <input
                  type="text"
                  value={newVideo.youtubeUrl}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, youtubeUrl: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                  placeholder="Enter YouTube URL"
                />
              </div>
              <div>
                <label className="text-gray-600">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  value={newVideo.languages}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, languages: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g., English, Spanish"
                />
              </div>
              <div>
                <label className="text-gray-600">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={newVideo.skills}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, skills: e.target.value })
                  }
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g., React, JavaScript"
                />
              </div>
              <div>
                <label className="text-gray-600 block mb-2">
                  Channel Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setNewVideo({
                        ...newVideo,
                        thumbnailFile: file,
                        thumbnailPreviewUrl: url,
                      });
                    }
                  }}
                  className="w-full"
                />
                {newVideo.thumbnailPreviewUrl && (
                  <div className="relative mt-2 w-32 h-32">
                    <button
                      onClick={() =>
                        setNewVideo({
                          ...newVideo,
                          thumbnailFile: null,
                          thumbnailPreviewUrl:
                            editingVideoIndex !== null
                              ? videos[editingVideoIndex].channelThumbnail
                              : null,
                        })
                      }
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
                      src={newVideo.thumbnailPreviewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVideo}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {editingVideoIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditRoadmap;
