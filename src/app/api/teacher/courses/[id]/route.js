import { connectionString } from "@/utils/db";
import { courseSchema } from "@/utils/models/courseModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, content) {
  const id = content.params.id;
  let result;
  let success = false;
  await mongoose.connect(connectionString);
  result = await courseSchema.find({ teacher_id: id });
  if (result) {
    success = true;
  }

  return NextResponse.json({ result, success });
}
