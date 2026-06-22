import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  const isLogin = pathname === "/admin/login";
  const isChange = pathname === "/admin/change-credentials";
  const isAdminRoot = pathname === "/admin";

  // /admin tout court : on laisse passer, c'est page.tsx qui redirige
  if (isAdminRoot) {
    return NextResponse.next();
  }

  // pas connecté → login (sauf si déjà sur login)
  if (!req.auth && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // connecté mais doit changer ses credentials → force la page dédiée
  if (req.auth && user?.mustChange && !isChange) {
    return NextResponse.redirect(new URL("/admin/change-credentials", req.url));
  }

  // déjà connecté et va sur /login → renvoie au dashboard
  if (req.auth && isLogin) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
