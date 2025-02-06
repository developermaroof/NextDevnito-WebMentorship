import { connectionString } from "@/utils/db";
import { courseSchema } from "@/utils/models/courseModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  const payload = await req.json();
  let result;
  let success = false;
  await mongoose.connect(connectionString);
  const course = new courseSchema(payload);
  result = await course.save();
  if (result) {
    success = true;
  }
  return NextResponse.json({ result, success });
}
