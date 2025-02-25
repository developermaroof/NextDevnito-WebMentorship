import { connectionString } from "@/utils/db";
import { roadmapSchema } from "@/utils/models/roadmapModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const formData = await req.formData();

    const title = formData.get("title");
    const subtitle = formData.get("subtitle");
    const description = formData.get("description");
    const contentType = formData.get("contentType");
    const uploadTitle = formData.get("uploadTitle");
    const uploadDescription = formData.get("uploadDescription");
    const ppt = formData.get("ppt");
    const seoDescription = formData.get("seoDescription");

    // Expect file to be a Cloudinary URL string
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
    };
    if (fileValue) {
      payload.file = fileValue;
    }

    await mongoose.connect(connectionString);
    const result = await roadmapSchema.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });
    const success = !!result;
    return NextResponse.json({ result, success });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message, success: false },
      { status: 500 }
    );
  }
}

export async function GET(req, context) {
  const { id } = await context.params;
  let result;
  let success = false;
  await mongoose.connect(connectionString);
  result = await roadmapSchema.findOne({ _id: id });
  if (result) {
    success = true;
  }
  return NextResponse.json({ result, success });
}
