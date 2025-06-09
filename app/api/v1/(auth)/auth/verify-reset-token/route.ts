import connect from "@/database/db";
import { NextResponse } from "next/server";
import { createHash } from "crypto";
import User from "../../users/models/user";

export const POST = async (request: Request) => {
  try {
    const { token } = await request.json();

    // Validate token
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Reset token is required",
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

    // Token is valid
    return NextResponse.json(
      {
        success: true,
        message: "Reset token is valid",
        data: {
          email: user.email, // You can include user email if needed
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify reset token error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
};
