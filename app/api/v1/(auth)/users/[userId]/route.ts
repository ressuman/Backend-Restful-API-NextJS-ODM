import connect from "@/database/db";
import { NextResponse } from "next/server";
import User from "../models/user";
import { Types } from "mongoose";

export const GET = async (
  request: Request,
  {
    params,
  }: {
    params: {
      userId: string;
    };
  }
) => {
  try {
    const { userId } = params;

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
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

    return NextResponse.json(
      {
        success: true,
        message: "User fetched successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching user",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: Request,
  {
    params,
  }: {
    params: {
      userId: string;
    };
  }
) => {
  try {
    const { userId } = params;
    const updatedData = await request.json();

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    await connect();

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found in the database",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error updating user",
        error: error.message,
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: Request,
  {
    params,
  }: {
    params: {
      userId: string;
    };
  }
) => {
  try {
    const { userId } = params;

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    await connect();

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found in the database",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
        data: deletedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting user",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
