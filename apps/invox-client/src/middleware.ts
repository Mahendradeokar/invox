import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export function middleware(request: NextRequest) {
  const cookieName = "_anonId";
  const reqCookies = request.cookies;
  let anonId = reqCookies.get(cookieName)?.value;

  if (!anonId) {
    anonId = uuidv4();

    const response = NextResponse.next();
    response.cookies.set(cookieName, anonId, {
      path: "/",
      sameSite: "lax",
      secure: false,
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365 * 100, // 100 years - will be default to cookie max age
    });

    if (request.nextUrl.pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/app";
      return NextResponse.redirect(url, { headers: response.headers });
    }

    return response;
  }

  return NextResponse.next();
}
