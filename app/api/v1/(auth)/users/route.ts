import connect from "@/database/db";
import { NextResponse } from "next/server";
import User from "./models/user";
import { Types } from "mongoose";

// const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "All users fetched successfully",
        data: users,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Error in fetching users",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
// export const GET = async () => {
//   try {
//     await connect();
//     const users = await User.find();

//     return new NextResponse(
//       JSON.stringify(
//         {
//           success: true,
//           message: "All users fetched successfully",
//           data: users,
//         },
//         null,
//         2 // <-- pretty print with 2 spaces
//       ),
//       {
//         status: 200,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   } catch (error: any) {
//     return new NextResponse(
//       JSON.stringify(
//         {
//           success: false,
//           message: "Error in fetching users",
//           error: error.message,
//         },
//         null,
//         2
//       ),
//       {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }
// };

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();

    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(
      JSON.stringify(
        {
          success: true,
          message: "User is created successfully",
          data: newUser,
        }
        // null,
        // 2
      ),
      {
        status: 201,
        // headers: {
        //   "Content-Type": "application/json",
        // },
      }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify(
        {
          success: false,
          message: "Error in creating user",
          error: error.message,
        }
        // null,
        // 2
      ),
      {
        status: 500,
        // headers: {
        //   "Content-Type": "application/json",
        // },
      }
    );
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User ID or new username not provided",
        }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid user ID",
        }),
        { status: 400 }
      );
    }

    await connect();

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: new Types.ObjectId(userId),
      },
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User not found in the database",
        }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify(
        {
          success: true,
          message: "User is updated successfully",
          data: updatedUser,
        }
        // null,
        // 2
      ),
      {
        status: 200,
        // headers: {
        //   "Content-Type": "application/json",
        // },
      }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify(
        {
          success: false,
          message: "Error in updating user",
          error: error.message,
        }
        // null,
        // 2
      ),
      {
        status: 500,
        // headers: {
        //   "Content-Type": "application/json",
        // },
      }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User ID not provided",
        }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid user ID",
        }),
        { status: 400 }
      );
    }

    await connect();

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User not found in the database",
        }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify(
        {
          success: true,
          message: "User is deleted successfully",
          data: deletedUser,
        }
        // null,
        // 2
      ),
      {
        status: 200,
        // headers: {
        //   "Content-Type": "application/json",
        // },
      }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify(
        {
          success: false,
          message: "Error in deleting user",
          error: error.message,
        }
        // null,
        // 2
      ),
      {
        status: 500,
        // headers: {
        //   "Content-Type": "application/json",
        // },
      }
    );
  }
};
