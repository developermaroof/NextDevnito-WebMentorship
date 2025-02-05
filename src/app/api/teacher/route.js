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
  let result;
  let success = false;
  await mongoose.connect(connectionString);
  if (payload.login) {
    // for Login
    result = await teacherSchema.findOne({
      email: payload.email,
      password: payload.password,
    });
    if (result) {
      success = true;
    }
  } else {
    // for signup
    const teacher = new teacherSchema(payload);
    result = await teacher.save();
    if (result) {
      success = true;
    }
  }

  return NextResponse.json({ result, success });
}
