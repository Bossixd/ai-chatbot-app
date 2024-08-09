"use server";

import { getSession } from "@/app/helper/auth";
import { NextRequest, NextResponse } from "next/server";

import pg from "pg";

const { Client } = pg;
const connectionString = process.env.DB_URL;

export async function POST(request: NextRequest) {
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

    const createChatQuery =
        "insert into chat (user_id, title) values ($1, null) returning chat_id;";
    const createChatRaw = await clientPosgres.query(createChatQuery, [userId]);
    const createChat = createChatRaw.rows;
    console.log(createChat);
    const chatId = createChat[0].chat_id;
    console.log(chatId)


    await clientPosgres.end();
    return NextResponse.json({
        success: true,
        chatId: chatId
    });
}
