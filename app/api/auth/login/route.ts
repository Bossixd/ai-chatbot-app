"use server";

import { NextResponse } from "next/server";

import passwordCheck from "@/app/helper/passwordCheck";
import { login } from "@/app/helper/auth";

import pg from "pg";

interface User {
    user_id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    join_datetime: Date;
}

const { Client } = pg;
const connectionString = process.env.DB_URL;

export async function POST(request: Request) {
    const { email, password } = await request.json();

    const client = new Client({
        connectionString,
    });

    await client.connect();

    const checkEmailQuery = "select * from users where email = $1";
    const checkEmailRaw = await client.query(checkEmailQuery, [email]);
    const checkEmail: User[] = checkEmailRaw.rows;

    if (checkEmail.length != 1)
        return NextResponse.json({
            success: false,
            reason: "This email is not registered. Please sign up!",
        });

    const storedPassword = checkEmail[0].password;
    if (!(await passwordCheck(password, storedPassword)))
        return NextResponse.json({
            success: false,
            reason: "Password is Incorrect!",
        });

    await login(email, password);

    await client.end();
    return NextResponse.json({
        success: true,
        reason: "",
    });
}
