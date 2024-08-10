import { NextRequest, NextResponse } from "next/server";
import { login, updateSession, getSession } from "./app/helper/auth";
import { useRouter } from "next/router";

export async function middleware(request: NextRequest) {
    const authorized_paths = ["/auth/login", "/auth/signup", "/", "/api/rag/add"]
    if (authorized_paths.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
    }

    const cookieExists = request.cookies.get("sessionInventoryManager")?.value;

    if (!cookieExists)
        return NextResponse.redirect(new URL("/auth/login", request.url));

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|api/auth).*)(.+)"],
};
