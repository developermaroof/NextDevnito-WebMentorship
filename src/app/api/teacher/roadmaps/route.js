import { connectionString } from "@/utils/db";
import { roadmapSchema } from "@/utils/models/roadmapModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  const formData = await req.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const teacher_id = formData.get("teacher_id");
  const fileValue = formData.get("file") || "";
  // Get resource_type from form data
  const resource_type = formData.get("resource_type") || "";

  const payload = {
    title,
    description,
    teacher_id,
    file: fileValue,
    resource_type, // Store resource_type in the database
  };

  await mongoose.connect(connectionString);
  const roadmap = new roadmapSchema(payload);
  const result = await roadmap.save();
  const success = !!result;
  return NextResponse.json({ result, success });
}
