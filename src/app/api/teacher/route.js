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

export async function POST(req) {
  let payload = await req.json();
  await mongoose.connect(connectionString);
  const teacher = new teacherSchema(payload);
  const result = await teacher.save();
  return NextResponse.json({ result, success: true });
}
