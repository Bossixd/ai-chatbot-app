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
    const { chatId, conversation } = await request.json();

    const clientPosgres = new Client({
        connectionString,
    });

    await clientPosgres.connect();

    const model_id = "mistral.mistral-7b-instruct-v0:2";
    const region = "us-east-1";

    var message =
        "Can you create a short header for this conversation? Only include what the conversation is about in a couple words. Only reply with the one header.\n\n";

    // Set messages format
    await conversation.map((dialogue: Dialogue) => {
        message += dialogue.is_user ? "User: " : "Assistant: ";
        message += dialogue.message + "\n";
    });

    const messages = [
        {
            role: "user",
            content: [
                {
                    text: message,
                },
            ],
        },
    ];

    // Set invoke inputs
    const clientBedrock = new BedrockRuntimeClient({ region: region });
    const input = {
        modelId: model_id,
        messages: messages,
        inferenceConfig: {
            maxTokens: 1000,
            temperature: 0.7,
            topP: 0.95,
        },
    };

    // Call LLM
    const command = new ConverseCommand(input as any);
    const response = await clientBedrock.send(command);
    const title = response.output?.message?.content?.[0].text;

    const updateChatQuery = "update chat set title = $1 where chat_id = $2;";
    clientPosgres.query(updateChatQuery, [title, chatId]);

    await clientPosgres.end();
    return NextResponse.json({
        success: true,
    });
}
