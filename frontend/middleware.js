import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const jwt = request.cookies.get("myTokenName");

  if (!jwt) return NextResponse.redirect(new URL("/login", request.url));

  try {
    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode("secret")
    );
    console.log({ payload });
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url)); // redirecciona al Login
  }
}

export const config = {
  matcher: ["/index/:path*","/registro/:path","/LibroContable/:path"],
};

  // this condition avoid to show the login page if the user is logged in
  // if (jwt) {
  //   if (request.nextUrl.pathname.includes("/login")) {
  //     try {
  //       await jwtVerify(jwt, new TextEncoder().encode("secret"));
  //       return NextResponse.redirect(new URL("/dashboard", request.url));
  //     } catch (error) {
  //       return NextResponse.next();
  //     }
  //   }
  // }
