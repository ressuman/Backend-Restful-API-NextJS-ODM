import connect from "@/database/db";
import User from "../../users/models/user";
import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import sgMail from "@sendgrid/mail";
import { getPasswordResetEmailTemplate } from "@/lib/email-templates";

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const POST = async (request: Request) => {
  const { email } = await request.json();

  // Validate email
  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { message: "Invalid email format" },
      { status: 400 }
    );
  }

  await connect();

  const existingUser = await User.findOne({ email });

  // Unified generic response (whether user exists or not)
  const genericSuccessResponse = {
    success: true,
    message:
      "If an account with this email exists, a reset link has been sent. Please check your email.",
  };

  // If user does not exist, return generic success response
  if (!existingUser) {
    // Don't reveal whether the email exists or not for security
    return NextResponse.json(genericSuccessResponse, { status: 200 });
  }

  // Generate reset token
  const resetToken = randomBytes(32).toString("hex");
  const hashedToken = createHash("sha256").update(resetToken).digest("hex");

  // Token expires in 1 hour
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  existingUser.resetToken = hashedToken;
  existingUser.resetTokenExpiry = resetTokenExpiry;

  // Save token to MongoDB
  await existingUser.save();
  // await User.findOneAndUpdate(
  //   { email },
  //   {
  //     resetToken: hashedToken,
  //     resetTokenExpiry,
  //   },
  //   { new: true, runValidators: true }
  // );

  // Create reset URL
  // const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

  // Get email template
  const { html, text } = getPasswordResetEmailTemplate(resetUrl, email);

  // Send email using SendGrid
  const msg = {
    to: email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL!,
      name: process.env.SENDGRID_FROM_NAME || "Your App Name",
    },
    subject: "Password Reset Request",
    html,
    text,
  };

  try {
    const result = await sgMail.send(msg);

    return NextResponse.json(
      {
        ...genericSuccessResponse,
        data: result,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Forgot password error:", err);

    // Clean up token if email failed to send
    existingUser.resetToken = undefined;
    existingUser.resetTokenExpiry = undefined;
    await existingUser.save();

    // Handle SendGrid specific errors
    if (err && typeof err === "object" && "response" in err) {
      const sgError = err as any;
      console.error("SendGrid error:", sgError.response?.body);
    }

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
};
