import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authRoutes = ["/login"];
const PUBLIC_PATHS = [
  "/api",
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/images/",
  "/videos/",
];

async function nextAuthMiddleware(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;
  const session = await getToken({ req: request, raw: true });

  const isRSCRequest = request.headers
    .get("accept")
    ?.includes("text/x-component");

  if (!session && !authRoutes.some((route) => pathname.startsWith(route))) {
    if (!isRSCRequest) {
      const callbackUrl = encodeURIComponent(`${pathname}${search}`);
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, request.url)
      );
    }
    return NextResponse.next();
  }

  if (session && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname, searchParams } = request.nextUrl;
  const privateRoutes = ["/my-orders", "/checkout"];

  if (
    searchParams.has("_rsc") ||
    request.headers.get("accept")?.includes("text/x-component")
  ) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (
    privateRoutes.some((route) => pathname.startsWith(route)) ||
    authRoutes.some((route) => pathname.startsWith(route))
  ) {
    return nextAuthMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/|favicon.ico|images/|videos/).*)",
};
