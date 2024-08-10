"use server";

import { NextRequest, NextResponse } from "next/server";

import {
    BedrockRuntimeClient,
    ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

import pg from "pg";

const { Client } = pg;
const connectionString = process.env.DB_URL;

interface Dialogue {
    is_user: boolean;
    message: string;
}

export async function POST(request: NextRequest) {
    const { chatId } = await request.json();
    console.log(chatId);

    const clientPosgres = new Client({
        connectionString,
    });

    await clientPosgres.connect();

    const deleteDialogueQuery = "delete from dialogue where chat_id = $1;";
    await clientPosgres.query(deleteDialogueQuery, [chatId]);

    const deleteChatQuery = "delete from chat where chat_id = $1";
    await clientPosgres.query(deleteChatQuery, [chatId])

    await clientPosgres.end();
    return NextResponse.json({
        success: true,
    });
}
