const { default: mongoose } = require("mongoose");

const teacherModel = new mongoose.Schema({
  name: String,
});

export const teacherSchema =
  mongoose.models.teachers || mongoose.model("teachers", teacherModel);
