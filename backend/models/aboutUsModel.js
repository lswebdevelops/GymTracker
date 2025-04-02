import mongoose from "mongoose";

const aboutusSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
 },
  {
    timestamps: true,
  }
);

const AboutUs = mongoose.model("aboutUs", aboutusSchema);

export default AboutUs;
