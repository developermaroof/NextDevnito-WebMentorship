import fs from "fs";
import path from "path";
import { connectionString } from "@/utils/db";
import { courseSchema } from "@/utils/models/courseModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  // Parse the form data
  const formData = await req.formData();

  // Extract fields
  const title = formData.get("title");
  const subtitle = formData.get("subtitle");
  const description = formData.get("description");
  const contentType = formData.get("contentType");
  const uploadTitle = formData.get("uploadTitle");
  const uploadDescription = formData.get("uploadDescription");
  const ppt = formData.get("ppt");
  const seoDescription = formData.get("seoDescription");
  const teacher_id = formData.get("teacher_id");

  // Process the file if it was sent
  let fileValue = "";
  const file = formData.get("file");
  if (file && typeof file !== "string") {
    // Generate a unique file name to avoid collisions
    const originalName = file.name;
    const uniqueFileName = `${Date.now()}_${originalName}`;
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      uniqueFileName
    );

    // Read file contents into a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save the file to the public/uploads folder
    await fs.promises.writeFile(filePath, buffer);
    fileValue = uniqueFileName;
  }

  // Create the payload
  const payload = {
    title,
    subtitle,
    description,
    contentType, // This should be set automatically on the client when file is selected
    uploadTitle,
    uploadDescription,
    ppt,
    seoDescription,
    teacher_id,
    file: fileValue, // Save the unique file name
  };

  await mongoose.connect(connectionString);
  const course = new courseSchema(payload);
  const result = await course.save();
  const success = !!result;
  return NextResponse.json({ result, success });
}
