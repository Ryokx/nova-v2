import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin routes
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Allow access in dev without login
      authorized: () => true,
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/booking/:path*",
    "/missions/:path*",
    "/mission/:path*",
    "/artisan/:path*",
    "/artisan-dashboard/:path*",
    "/artisan-payments/:path*",
    "/artisan-documents/:path*",
    "/artisan-devis/:path*",
    "/artisan-invoices/:path*",
    "/artisan-clients/:path*",
    "/artisan-compta/:path*",
    "/artisan-profile/:path*",
    "/artisan-notifications/:path*",
    "/artisan-qr-code/:path*",
    "/artisan-subscription/:path*",
    "/artisan-addons/:path*",
    "/artisan-pricing/:path*",
    "/artisan-instant-pay/:path*",
    "/artisan-website/:path*",
    "/artisan-communication/:path*",
    "/artisan-newsletter/:path*",
    "/admin/:path*",
    "/api/((?!auth|webhooks|upload|pusher).*)/:path*",
  ],
};
