"use server";

import { NextRequest, NextResponse } from "next/server";

import pg from "pg";

interface Dialogue {
    user_id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    join_datetime: Date;
}

const { Client } = pg;
const connectionString = process.env.DB_URL;

export async function POST(request: NextRequest) {
    const { chatId } = await request.json();
    console.log("Chat Id: ", chatId);

    const clientPosgres = new Client({
        connectionString,
    });

    await clientPosgres.connect();

    const getDialogueQuery =
        "select is_user, message from dialogue where chat_id = $1 order by sequence";
    const getDialogueRaw = await clientPosgres.query(getDialogueQuery, [chatId]);
    const getDialogue = getDialogueRaw.rows;

    await clientPosgres.end();
    return NextResponse.json({
        success: true,
        messages: getDialogue
    });
}
