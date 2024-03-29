import pkg from "mongoose";

const { Schema, model } = pkg;
// Create Schema
const FileSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
    unique: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const File = model("File", FileSchema);

export default File;
