import connect from "@/database/db";
import User from "../../users/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request: Request) => {
  const { email, username, password } = await request.json();

  await connect();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json(
      {
        success: false,
        message: "Email is already in use",
      },
      { status: 400 }
    );
  }

  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    return NextResponse.json(
      {
        success: false,
        message: "Username is already in use",
      },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    email,
    username,
    password: hashedPassword,
  });

  try {
    const savedUser = await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "User is registered successfully",
        data: savedUser,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
};
