import { NextRequest, NextResponse } from "next/server";
import { logMiddleware } from "./middlewares/api/logMiddleware";
import { authMiddleware } from "./middlewares/api/authMiddleware";

export const config = {
  matcher: "/api/v1/:path*",
};

// Define public routes
const PUBLIC_ROUTES = [
  "/api/v1/users",
  // "/api/v1/auth/login",
  "/api/v1/auth/register",
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log only for /api/v1/blogs routes
  if (pathname.startsWith("/api/v1/blogs")) {
    const logResult = logMiddleware(request);
    console.log("[BLOG LOG]", logResult.response);

    if (logResult && logResult.message) {
      console.log("[BLOG LOG]", logResult.message);
    }

    if (logResult && logResult.response) {
      console.log("[BLOG LOG]", logResult.response);
    }
  }

  // Log only for /api/v1/categories routes
  if (pathname.startsWith("/api/v1/categories")) {
    const logResult = logMiddleware(request);
    console.log("[CATEGORY LOG]", logResult.response);

    if (logResult && logResult.message) {
      console.log("[CATEGORY LOG]", logResult.message);
    }

    if (logResult && logResult.response) {
      console.log("[CATEGORY LOG]", logResult.response);
    }
  }

  // Log only for /api/v1/users routes
  if (pathname.startsWith("/api/v1/users")) {
    const logResult = logMiddleware(request);
    console.log("[USER LOG]", logResult.response);

    if (logResult && logResult.message) {
      console.log("[USER LOG]", logResult.message);
    }

    if (logResult && logResult.response) {
      console.log("[USER LOG]", logResult.response);
    }
  }

  // Log only for /api/v1/notes routes
  if (pathname.startsWith("/api/v1/notes")) {
    const logResult = logMiddleware(request);
    console.log("[NOTE LOG]", logResult.response);

    if (logResult && logResult.message) {
      console.log("[NOTE LOG]", logResult.message);
    }

    if (logResult && logResult.response) {
      console.log("[NOTE LOG]", logResult.response);
    }
  }

  // If it's a public route, skip auth
  const isPublic = PUBLIC_ROUTES.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  );
  if (isPublic) {
    return NextResponse.next();
  }

  // Apply auth check to all others /api/v1 routes
  const authResult = authMiddleware(request);
  if (!authResult?.isValid) {
    return new NextResponse(
      JSON.stringify({
        message: "Unauthorized",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return NextResponse.next();
}
