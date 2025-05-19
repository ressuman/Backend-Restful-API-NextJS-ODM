import connect from "@/database/db";
import User from "../../../(auth)/users/models/user";
import Note from "../models/notes";
import { Types } from "mongoose";

export const getNotes = async (userId: string) => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid or missing userId");
  }

  await connect();

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  return await Note.find({ user: userId });
};

export const createNote = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    blog?: string;
    category?: string;
  }
) => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid or missing userId");
  }

  await connect();

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const newNote = new Note({
    title: data.title,
    description: data.description,
    blog: data.blog,
    category: data.category,
    user: new Types.ObjectId(userId),
  });

  await newNote.save();
  return newNote;
};

export const updateNote = async (
  userId: string,
  noteId: string,
  data: {
    title?: string;
    description?: string;
    blog?: string;
    category?: string;
  }
) => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid or missing userId");
  }

  if (!noteId || !Types.ObjectId.isValid(noteId)) {
    throw new Error("Invalid or missing noteId");
  }

  await connect();

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw new Error("Note not found or does not belong to the user");

  return await Note.findByIdAndUpdate(noteId, data, { new: true });
};

export const updateAllNote = async ({
  noteId,
  userId,
  title,
  description,
  blog,
  category,
}: {
  noteId: string;
  userId: string;
  title: string;
  description: string;
  blog?: string;
  category?: string;
}) => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    return { status: 400, data: { message: "Invalid or missing userId" } };
  }

  if (!noteId || !Types.ObjectId.isValid(noteId)) {
    return { status: 400, data: { message: "Invalid or missing noteId" } };
  }

  await connect();

  const user = await User.findById(userId);
  if (!user) {
    return { status: 404, data: { message: "User not found" } };
  }

  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) {
    return {
      status: 404,
      data: { message: "Note not found or does not belong to the user" },
    };
  }

  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    {
      title,
      description,
      blog: blog || null,
      category: category || null,
    },
    { new: true }
  );

  return { status: 200, data: { message: "Note updated", note: updatedNote } };
};

export const deleteNote = async (userId: string, noteId: string) => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid or missing userId");
  }

  if (!noteId || !Types.ObjectId.isValid(noteId)) {
    throw new Error("Invalid or missing noteId");
  }

  await connect();

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw new Error("Note not found or does not belong to the user");

  await Note.findByIdAndDelete(noteId);
  return true;
};

export const getNoteById = async (userId: string, noteId: string) => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid or missing userId");
  }

  if (!noteId || !Types.ObjectId.isValid(noteId)) {
    throw new Error("Invalid or missing noteId");
  }

  await connect();

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) throw new Error("Note not found or does not belong to the user");

  return note;
};
