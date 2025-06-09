import connect from "@/database/db";

import { NextResponse } from "next/server";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import User from "../../users/models/user";

export const POST = async (request: Request) => {
  try {
    const { token, password } = await request.json();

    // Validate inputs
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Reset token is required",
        },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required",
        },
        { status: 400 }
      );
    }

    // Validate password strength
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    if (!hasUpperCase) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must contain at least one uppercase letter",
        },
        { status: 400 }
      );
    }

    if (!hasLowerCase) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must contain at least one lowercase letter",
        },
        { status: 400 }
      );
    }

    if (!hasNumbers) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must contain at least one number",
        },
        { status: 400 }
      );
    }

    if (!hasSpecialChar) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must contain at least one special character",
        },
        { status: 400 }
      );
    }

    await connect();

    // Hash the token to match what's stored in the database
    const hashedToken = createHash("sha256").update(token).digest("hex");

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() }, // Token must not be expired
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token",
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Password has been reset successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
};
