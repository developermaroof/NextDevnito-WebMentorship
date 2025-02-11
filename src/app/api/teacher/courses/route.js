// Import the Node.js file system module to handle file operations (reading/writing files)
import fs from "fs";
// Import the Node.js path module to work with file and directory paths
import path from "path";
// Import the database connection string from a local utility file
import { connectionString } from "@/utils/db";
// Import the course model schema from a local models file to interact with the courses collection
import { courseSchema } from "@/utils/models/courseModel";
// Import Mongoose, an ODM (Object Data Modeling) library for MongoDB
import mongoose from "mongoose";
// Import NextResponse from Next.js to generate server responses
import { NextResponse } from "next/server";

// Export an asynchronous function named POST to handle POST requests in this API route
export async function POST(req) {
  // Parse the incoming request's form data into a FormData object
  const formData = await req.formData();

  // Extract the 'title' field from the form data
  const title = formData.get("title");
  // Extract the 'subtitle' field from the form data
  const subtitle = formData.get("subtitle");
  // Extract the 'description' field from the form data
  const description = formData.get("description");
  // Extract the 'contentType' field from the form data (typically the MIME type of the file)
  const contentType = formData.get("contentType");
  // Extract the 'uploadTitle' field from the form data
  const uploadTitle = formData.get("uploadTitle");
  // Extract the 'uploadDescription' field from the form data
  const uploadDescription = formData.get("uploadDescription");
  // Extract the 'ppt' field from the form data (possibly a title or identifier for a presentation)
  const ppt = formData.get("ppt");
  // Extract the 'seoDescription' field from the form data for SEO purposes
  const seoDescription = formData.get("seoDescription");
  // Extract the 'teacher_id' field from the form data to associate the course with a teacher
  const teacher_id = formData.get("teacher_id");

  // Initialize a variable to hold the file name (empty string if no file is provided)
  let fileValue = "";
  // Get the file from the form data under the key "file"
  const file = formData.get("file");
  // Check if a file was provided and ensure it is not a string (i.e., it's a file object)
  if (file && typeof file !== "string") {
    // Get the original file name from the file object
    const originalName = file.name;
    // Generate a unique file name by prefixing the current timestamp to avoid file name collisions
    const uniqueFileName = `${Date.now()}_${originalName}`;
    // Construct the full file path by joining the current working directory, "public/uploads", and the unique file name
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      uniqueFileName
    );

    // Read the file's content into an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Convert the ArrayBuffer to a Node.js Buffer for writing to the file system
    const buffer = Buffer.from(arrayBuffer);

    // Write the file to the specified path (saving it to the public/uploads folder)
    await fs.promises.writeFile(filePath, buffer);
    // Set fileValue to the unique file name so it can be stored in the database later
    fileValue = uniqueFileName;
  }

  // Create a payload object containing all the extracted form fields and the processed file value
  const payload = {
    title, // Course title
    subtitle, // Course subtitle
    description, // Course description
    contentType, // MIME type of the file (set on the client when file is selected)
    uploadTitle, // Title for the uploaded resource
    uploadDescription, // Description for the uploaded resource
    ppt, // PPT title or identifier
    seoDescription, // SEO description for the course
    teacher_id, // ID of the teacher creating the course
    file: fileValue, // Unique file name saved on the server (or empty if no file)
  };

  // Connect to the MongoDB database using the provided connection string
  await mongoose.connect(connectionString);
  // Create a new course document using the course schema and the payload data
  const course = new courseSchema(payload);
  // Save the course document to the database and await the result
  const result = await course.save();
  // Determine the success status based on whether the result exists (convert to a boolean)
  const success = !!result;
  // Return a JSON response containing the saved course document and the success status
  return NextResponse.json({ result, success });
}
