import { connectionString } from "@/utils/db";
import { roadmapSchema } from "@/utils/models/roadmapModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  const formData = await req.formData();
  const title = formData.get("title");
  const subtitle = formData.get("subtitle");
  const description = formData.get("description");
  const contentType = formData.get("contentType");
  const uploadTitle = formData.get("uploadTitle");
  const uploadDescription = formData.get("uploadDescription");
  const ppt = formData.get("ppt");
  const seoDescription = formData.get("seoDescription");
  const teacher_id = formData.get("teacher_id");

  // Here, file is expected to be a Cloudinary URL string.
  const fileValue = formData.get("file") || "";

  const payload = {
    title,
    subtitle,
    description,
    contentType,
    uploadTitle,
    uploadDescription,
    ppt,
    seoDescription,
    teacher_id,
    file: fileValue,
  };

  await mongoose.connect(connectionString);
  const roadmap = new roadmapSchema(payload);
  const result = await roadmap.save();
  const success = !!result;
  return NextResponse.json({ result, success });
}
