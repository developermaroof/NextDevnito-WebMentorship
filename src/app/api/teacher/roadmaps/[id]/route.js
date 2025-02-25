import { connectionString } from "@/utils/db";
import { roadmapSchema } from "@/utils/models/roadmapModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { id } = await context.params;
  let result;
  let success = false;
  await mongoose.connect(connectionString);
  result = await roadmapSchema.find({ teacher_id: id });
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
  result = await roadmapSchema.deleteOne({ _id: id });
  if (result.deletedCount > 0) {
    success = true;
  }

  return NextResponse.json({ result, success });
}
