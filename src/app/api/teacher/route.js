import { connectionString } from "@/utils/db";
import { teacherSchema } from "@/utils/models/teacherModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await mongoose.connect(connectionString);
  const data = await teacherSchema.find();
  console.log(data);

  return NextResponse.json({ result: data, success: true });
}
