import { NextResponse } from "next/server";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "./controllers/noteController";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    const notes = await getNotes(userId!);
    return NextResponse.json(notes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const POST = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const data = await request.json();

  try {
    const note = await createNote(userId!, data);
    return NextResponse.json(
      { message: "Note created", note },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const PATCH = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const { noteId, ...updateFields } = await request.json();

  try {
    const updatedNote = await updateNote(userId!, noteId, updateFields);
    return NextResponse.json(
      { message: "Note updated", note: updatedNote },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const DELETE = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const noteId = searchParams.get("noteId");

  try {
    await deleteNote(userId!, noteId!);
    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
