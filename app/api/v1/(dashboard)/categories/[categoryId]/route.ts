import { NextResponse } from "next/server";
import Category from "../models/category";
import { Types } from "mongoose";
import connect from "@/database/db";

// PUT: Update category title
export const PUT = async (
  request: Request,
  {
    params,
  }: {
    params: {
      categoryId: string;
    };
  }
) => {
  try {
    const { categoryId } = params;
    const { title } = await request.json();

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or missing categoryId",
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

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating category",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

// DELETE: Remove category
export const DELETE = async (
  request: Request,
  {
    params,
  }: {
    params: {
      categoryId: string;
    };
  }
) => {
  try {
    const { categoryId } = params;

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or missing categoryId",
        },
        { status: 400 }
      );
    }

    await connect();

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
        data: deletedCategory,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting category",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const GET = async (
  _req: Request,
  { params }: { params: { categoryId: string } }
) => {
  try {
    const { categoryId } = params;
    if (!Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { message: "Invalid category ID" },
        { status: 400 }
      );
    }

    await connect();
    const category = await Category.findById(categoryId);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error: any) {
    return new NextResponse("Error fetching category: " + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (
  request: Request,
  { params }: { params: { categoryId: string } }
) => {
  try {
    const { categoryId } = params;
    const updates = await request.json();

    if (!Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { message: "Invalid category ID" },
        { status: 400 }
      );
    }

    await connect();
    const patchedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updates,
      { new: true }
    );

    if (!patchedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category patched successfully",
      data: patchedCategory,
    });
  } catch (error: any) {
    return new NextResponse("Error patching category: " + error.message, {
      status: 500,
    });
  }
};
