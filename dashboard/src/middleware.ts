import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Matches the pages that require authentication
});

export const config = {
  // Protect all routes except the auth api routes and the public static files
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
