import { connectionString } from "@/utils/db";
import { roadmapSchema } from "@/utils/models/roadmapModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
  try {
    await mongoose.connect(connectionString);
    const { id } = context.params;
    const formData = await req.formData();

    const payload = {
      title: formData.get("title") || "",
      description: formData.get("description") || "",
      teacher_id: formData.get("teacher_id") || "",
      file: formData.get("file") || "",
      resource_type: formData.get("resource_type") || "",
    };

    const result = await roadmapSchema.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Roadmap not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result, success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message, success: false },
      { status: 500 }
    );
  }
}

export async function GET(req, context) {
  try {
    await mongoose.connect(connectionString);
    const { id } = context.params;
    const result = await roadmapSchema.findOne({ _id: id });

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Roadmap not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ result, success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message, success: false },
      { status: 500 }
    );
  }
}
