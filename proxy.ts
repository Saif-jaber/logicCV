import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PROTECTED_PREFIX = "/dashboard";
const AUTH_PAGES = ["/sign-in", "/sign-up"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth);
  const pathname = nextUrl.pathname;

  if (pathname.startsWith(PROTECTED_PREFIX) && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (AUTH_PAGES.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|ico|jpg|jpeg|webp)$).*)",
  ],
};