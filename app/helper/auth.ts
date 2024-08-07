"use server"

import { keyframes } from "@emotion/react";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1 hour from now")
        .sign(key);
}

export async function decrypt(input: string) {
    console.log(input);
    const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
    return payload;
}

export async function login(username: string, password: string) {
    const user = {
        username: username,
    };

    // Create session
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const session = await encrypt({ user, expires });

    // Save session to cookie
    cookies().set("sessionInventoryManager", session, {
        expires,
        httpOnly: true,
    });
}

export async function logout() {
    // Destroy the session
    cookies().set("sessionInventoryManager", "", { expires: new Date(0) });
}

export async function getSession() {
    const session = cookies().get("sessionInventoryManager")?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("sessionInventoryManager")?.value;
    if (!session) return;

    // Refresh session so it doesn't expire
    // const parsed = await decrypt(session);
    // parsed.expires = new Date(Date.now() + 60 * 60 * 1000);
    // const res = NextResponse.next();
    // res.cookies.set({
    //     name: "sessionInventoryManager",
    //     value: await encrypt(parsed),
    //     httpOnly: true,
    //     expires: parsed.expires,
    // });

    // return res;
}
