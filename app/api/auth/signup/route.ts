"use server";

import { NextResponse } from "next/server";

import emailCheck from "@/app/helper/emailCheck";
import encryptPassword from "@/app/helper/encryptPassword";
import { login } from "@/app/helper/auth";

import pg from "pg";

const { Client } = pg;
const connectionString = process.env.DB_URL;

export async function POST(request: Request) {
    const { firstname, lastname, email, password } = await request.json();

    if (!(await emailCheck(email)))
        return NextResponse.json({
            success: false,
            reason: "Email is Incorrect!",
        });

    const encryptedPassword = await encryptPassword(password);

    const client = new Client({
        connectionString,
    });

    await client.connect();

    const query =
        "insert into users (firstname, lastname, email, password) values ($1, $2, $3, $4)";
    await client.query(query, [firstname, lastname, email, encryptedPassword]);

    console.log(password, encryptedPassword)

    await client.end();

    return NextResponse.json({
        success: true,
        reason: "",
    });
}
