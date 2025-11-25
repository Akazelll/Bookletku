import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // 1. Cek User Session
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Ambil Role User (Jika Login)
  let userRole = "user"; // Default role
  
  if (user) {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();
      
    if (data?.role) {
      userRole = data.role;
    }
  }

  const path = request.nextUrl.pathname;

  // 3. Proteksi Halaman Admin (Hanya Owner/Admin)
  if (path.startsWith("/admin")) {
    // Jika belum login -> Login page
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Jika login tapi role bukan owner/admin -> Lempar ke Menu Public
    if (userRole !== "owner" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/menu/public", request.url));
    }
  }

  // 4. Redirect Cerdas Halaman Login (Jika sudah login)
  if (path === "/login" && user) {
    if (userRole === "owner" || userRole === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/menu/public", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};