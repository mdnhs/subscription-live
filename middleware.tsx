import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authRoutes = ["/login","/register"];
const privateRoutes = ["/my-orders", "/checkout"];
const PUBLIC_PATHS = [
  "/api",
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/images/",
  "/videos/",
];

async function nextAuthMiddleware(request: NextRequest): Promise<NextResponse> {
  const { pathname, search, origin } = request.nextUrl;

  // Debug logging (remove in production)
  console.log(`Middleware processing: ${pathname}`);

  try {
    const session = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    // console.log("Session token:", session); // Debug

    const isRSCRequest = request.headers
      .get("accept")
      ?.includes("text/x-component");

    // If no session and trying to access protected route
    if (!session && privateRoutes.some((route) => pathname.startsWith(route))) {
      console.log("No session, redirecting to login");
      if (!isRSCRequest) {
        const callbackUrl = encodeURIComponent(`${pathname}${search}`);
        return NextResponse.redirect(
          new URL(`/login?callbackUrl=${callbackUrl}`, origin)
        );
      }
      return NextResponse.next();
    }

    // If session exists but trying to access auth route
    if (session && authRoutes.some((route) => pathname.startsWith(route))) {
      console.log("Session exists, redirecting from auth route");
      return NextResponse.redirect(new URL("/", origin));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Skip public paths
  if (PUBLIC_PATHS.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Handle RSC requests
  if (
    request.nextUrl.searchParams.has("_rsc") ||
    request.headers.get("accept")?.includes("text/x-component")
  ) {
    return NextResponse.next();
  }

  // Handle auth and private routes
  if (
    privateRoutes.some((route) => pathname.startsWith(route)) ||
    authRoutes.some((route) => pathname.startsWith(route))
  ) {
    return nextAuthMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|images/|videos/).*)",
};
