// Tells Next.js that this component should be rendered on the client side
"use client";

// Import React and specific hooks (useEffect, useState) from the React library
import React, { useEffect, useState } from "react";

// Import the Link component from Next.js to handle client-side navigation
import Link from "next/link";

// Define a functional component named Courses
const Courses = () => {
  // Declare a state variable 'courses' to hold course data and 'setCourses' as its updater function; initially undefined
  const [courses, setCourses] = useState();

  // useEffect hook that runs once when the component mounts (empty dependency array means it runs only on the initial render)
  useEffect(() => {
    // Call the loadCourses function to fetch courses data when the component mounts
    loadCourses();
  }, []);

  // Define an asynchronous function to load courses from the API
  const loadCourses = async () => {
    // Retrieve the teacher data from local storage and parse it from a JSON string to a JavaScript object
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    // Extract the teacher's ID from the teacherData object
    const teacher_id = teacherData._id;
    // Make an HTTP GET request to fetch courses for the given teacher ID from the backend API
    let response = await fetch(
      `http://localhost:3000/api/teacher/courses/${teacher_id}`
    );
    // Parse the API response as JSON
    response = await response.json();
    // Check if the response indicates a successful operation
    if (response.success) {
      // If successful, update the 'courses' state with the fetched course results
      setCourses(response.result);
    } else {
      // If the API call fails, show an alert message to the user
      alert("Failed to load courses!");
    }
  };

  return (
    // Outer container div for the whole component
    <div>
      {/* Header section: flex container that spaces elements between */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
          Courses
        </h1>
        <div className="flex items-center gap-2">
          <button className="text-xs lg:text-sm xl:text-base 2xl:text-lg px-3 lg:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Link href="/teacher/dashboard/courses/addcourse">Add Course</Link>
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

      {/* Courses list container: flex container that wraps items and adds spacing */}
      <div className="flex flex-wrap gap-4">
        {/* Check if 'courses' exists; if yes, map over the array to render each course */}
        {courses &&
          courses.map((item, index) => (
            // Each course card container with a unique key, border, padding, and max width style
            <div key={index} className="border p-4 max-w-[300px]">
              {/* Display the course title in bold */}
              <h2 className="font-bold">{item.title}</h2>
              {/* Display the course description */}
              <p>{item.description}</p>

              {/* If a file is associated with the course, render a section for it */}
              {item.file && (
                // Container for the file display with top margin
                <div className="mt-2">
                  {/* Check if the file's content type indicates an image */}
                  {item.contentType && item.contentType.startsWith("image/") ? (
                    // If it is an image, render the image using the file path
                    <img
                      src={`/uploads/${item.file}`}
                      alt={item.uploadTitle || "Course File"} // Use a custom title if available, otherwise a default alt text
                      className="w-full h-auto object-cover rounded"
                    />
                  ) : (
                    // If it is not an image, provide a link to view/download the file in a new tab
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

// Export the Courses component as the default export so it can be imported in other files
export default Courses;
