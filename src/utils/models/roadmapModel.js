const { default: mongoose } = require("mongoose");

const roadmapModel = new mongoose.Schema({
  title: String,
  description: String,
  file: String,
  teacher_id: mongoose.Schema.Types.ObjectId,
  resource_type: String,
  videos: [
    {
      title: String,
      channelThumbnail: String,
      channelName: String,
      youtubeUrl: String,
      languages: [String],
      skills: [String],
    },
  ],
});

export const roadmapSchema =
  mongoose.models.roadmaps || mongoose.model("roadmaps", roadmapModel);
