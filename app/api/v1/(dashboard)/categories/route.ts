import { NextResponse } from "next/server";
import Category from "./models/category";
import User from "../../(auth)/users/models/user";
import connect from "@/database/db";
import { Types } from "mongoose";

// GET categories for a specific user
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or missing userId",
        },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found in the database",
        },
        { status: 404 }
      );
    }

    const categories = await Category.find({
      user: userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Categories fetched successfully",
        data: categories,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error in fetching categories",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

// POST a new category for a user
export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or missing userId",
        },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required and must be a string",
        },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const newCategory = new Category({
      title,
      user: userId,
    });

    await newCategory.save();

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error in creating category",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
