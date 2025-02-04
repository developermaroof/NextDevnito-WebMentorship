const { default: mongoose } = require("mongoose");

const teacherModel = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  city: String,
  address: String,
  contact: String,
});

export const teacherSchema =
  mongoose.models.teachers || mongoose.model("teachers", teacherModel);
