"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/helper/auth";

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
    // const { email, password } = await request.json();
    const session: any = await getSession();
    const username = session?.user?.username;

    const clientPosgres = new Client({
        connectionString,
    });

    await clientPosgres.connect();

    const getUserIdQuery = "select user_id from users where email = $1";
    const getUserIdRaw = await clientPosgres.query(getUserIdQuery, [username]);
    const getUserId = getUserIdRaw.rows;
    const userId = getUserId[0].user_id;

    const getChatQuery = "select * from chat where user_id = $1";
    const getChatRaw = await clientPosgres.query(getChatQuery, [userId]);
    const getChat = getChatRaw.rows;
    console.log(getChat);

    const chats = getChat.map((chat) => {
        return {
            title: (chat.title == null) ? "New Chat" : chat.title,
            chat_id: chat.chat_id,
        };
    });


    await clientPosgres.end();
    return NextResponse.json({
        success: true,
        chats: chats
    });
}
