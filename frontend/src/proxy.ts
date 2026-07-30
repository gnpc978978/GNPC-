import { NextResponse } from "next/server";

export function proxy() {
  // Authentication is bearer-token based and checked by the client guard and
  // protected backend APIs. A proxy cannot read localStorage, so redirecting
  // here incorrectly rejects valid sessions and can mask a 403 as a redirect.
  return NextResponse.next();
}



export const config = {

  matcher: ["/admin/:path*"],

};
