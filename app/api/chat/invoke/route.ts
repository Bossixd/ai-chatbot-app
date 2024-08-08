"use server";

import { NextResponse } from "next/server";

import pg from "pg";

import {
    BedrockRuntimeClient,
    ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { Content } from "next/font/google";

interface Dialogue {
    is_user: boolean;
    message: string;
}

interface Output {
    text: string;
}

const { Client } = pg;
const connectionString = process.env.DB_URL;

export async function POST(request: Request) {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/ConverseCommand/

    const model_id = "mistral.mistral-7b-instruct-v0:2";
    const region = "us-east-1";
    const { conversation } = await request.json();
    const chatId = "03b0d96d-1796-4742-9db5-b69551f7862d";

    // Set messages format
    const messages = conversation.map((dialogue: Dialogue) => {
        return {
            role: dialogue.is_user ? "user" : "assistant",
            content: [
                {
                    text: dialogue.message,
                },
            ],
        };
    });

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
    const command = new ConverseCommand(input);
    const response = await clientBedrock.send(command);
    const message = response.output?.message?.content?.[0].text;

    // Insert data into db
    const clientPosgres = new Client({
        connectionString,
    });
    await clientPosgres.connect();

    // Insert user message into db
    const setDialogueQuery =
        "insert into dialogue (chat_id, is_user, message, sequence) values ($1, $2, $3, $4);";
    await clientPosgres.query(setDialogueQuery, [
        chatId,
        true,
        conversation.at(-1).message,
        conversation.length,
    ]);

    // Add LLM output to conversation
    conversation.push({ is_user: false, message: message });

    // Insert LLM message into db
    await clientPosgres.query(setDialogueQuery, [
        chatId,
        false,
        message,
        conversation.length,
    ]);

    await clientPosgres.end();

    return NextResponse.json({
        conversation: conversation
    });
}
