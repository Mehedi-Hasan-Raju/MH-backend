import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: [true, "Degree Required!"],
  },
  institute: {
    type: String,
    required: [true, "Institute Required!"],
  },
  grade: {
    type: String,
  },
  duration: {
    from: {
      type: String,
      required: [true, "Start Year Required!"],
    },
    to: {
      type: String,
    },
  },
});

export const Education = mongoose.model("Education", educationSchema);