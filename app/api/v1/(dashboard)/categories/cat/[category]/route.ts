import { NextResponse } from "next/server";
import Category from "../../models/category";
import User from "@/app/api/v1/(auth)/users/models/user";
import connect from "@/database/db";
import { Types } from "mongoose";

export const PATCH = async (
  request: Request,
  context: {
    params: {
      category: string;
    };
  }
) => {
  const categoryId = context.params.category;

  try {
    const { title } = await request.json();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findOneAndUpdate(
      { _id: categoryId, user: userId },
      { title },
      { new: true }
    );

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Category updated",
        category,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error updating category: " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (
  request: Request,
  context: {
    params: {
      category: string;
    };
  }
) => {
  const categoryId = context.params.category;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findOneAndDelete({
      _id: categoryId,
      user: userId,
    });

    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message: "Category not found or does not belong to the user",
        }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify({ message: "Category deleted" }), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error deleting category: " + error.message, {
      status: 500,
    });
  }
};
