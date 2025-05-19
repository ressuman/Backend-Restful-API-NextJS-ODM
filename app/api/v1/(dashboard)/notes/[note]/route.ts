import { NextResponse } from "next/server";
import { getNoteById, updateAllNote } from "../controllers/noteController";

export const GET = async (
  request: Request,
  context: { params: { note: string } }
) => {
  const noteId = context.params.note;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    const note = await getNoteById(userId!, noteId);
    return NextResponse.json(note, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const PUT = async (
  request: Request,
  context: { params: { note: string } }
) => {
  try {
    const noteId = context.params.note;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const { title, description, blog, category } = await request.json();

    const { status, data } = await updateAllNote({
      noteId,
      userId: userId || "",
      title,
      description,
      blog,
      category,
    });

    return new NextResponse(JSON.stringify(data), { status });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error in updating note", error }),
      { status: 500 }
    );
  }
};
