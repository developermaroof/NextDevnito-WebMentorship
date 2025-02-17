import fs from "fs";
import path from "path";
import { connectionString } from "@/utils/db";
import { courseSchema } from "@/utils/models/courseModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(req, content) {
  try {
    const id = content.params.id; // Use content.params.id
    const formData = await req.formData();

    const title = formData.get("title");
    const subtitle = formData.get("subtitle");
    const description = formData.get("description");
    const contentType = formData.get("contentType");
    const uploadTitle = formData.get("uploadTitle");
    const uploadDescription = formData.get("uploadDescription");
    const ppt = formData.get("ppt");
    const seoDescription = formData.get("seoDescription");

    let fileValue = "";
    const file = formData.get("file");
    if (file && typeof file !== "string") {
      const originalName = file.name;
      const uniqueFileName = `${Date.now()}_${originalName}`;
      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        uniqueFileName
      );
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.promises.writeFile(filePath, buffer);
      fileValue = uniqueFileName;
    }

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
    const result = await courseSchema.findOneAndUpdate({ _id: id }, payload, {
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

export async function GET(req, content) {
  const id = content.params.id;
  let result;
  let success = false;
  await mongoose.connect(connectionString);
  result = await courseSchema.findOne({ _id: id });
  if (result) {
    success = true;
  }
  return NextResponse.json({ result, success });
}
