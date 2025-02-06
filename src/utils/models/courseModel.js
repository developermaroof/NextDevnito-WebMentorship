const { default: mongoose } = require("mongoose");

const courseModel = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  contentType: String,
  uploadTitle: String,
  uploadDescription: String,
  file: String,
  ppt: String,
  seoDescription: String,
  teacher_id: mongoose.Schema.Types.ObjectId,
});

export const courseSchema =
  mongoose.models.courses || mongoose.model("courses", courseModel);
