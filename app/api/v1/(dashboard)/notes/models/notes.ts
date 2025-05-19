import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Note = models.Note || model("Note", NoteSchema);

export default Note;
