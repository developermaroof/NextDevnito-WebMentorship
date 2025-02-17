import { connectionString } from "@/utils/db";
import { courseSchema } from "@/utils/models/courseModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { id } = await context.params;
  let result;
  let success = false;
  await mongoose.connect(connectionString);
  result = await courseSchema.find({ teacher_id: id });
  if (result) {
    success = true;
  }

  return NextResponse.json({ result, success });
}

export async function DELETE(req, context) {
  const { id } = await context.params;
  let result;
  let success = false;
  await mongoose.connect(connectionString);
  result = await courseSchema.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    success = true;
  }

  return NextResponse.json({ result, success });
}
