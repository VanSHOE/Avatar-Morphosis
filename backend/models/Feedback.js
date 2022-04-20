import pkg from "mongoose";
const { Schema, model } = pkg;
// Create Schema
const FeedbackSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
    required: true,
  },
});

const Feedback = model("Feedback", FeedbackSchema);

export default Feedback;
