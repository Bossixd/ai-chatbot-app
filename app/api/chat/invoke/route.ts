"use server";

import { NextResponse } from "next/server";

import { Pinecone } from "@pinecone-database/pinecone";

import pg from "pg";

import {
    BedrockRuntimeClient,
    ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const apiKey: string = process.env.PINECONE_API_KEY!;

const indexName = "aws-case-studies-and-blogs";
const model = "multilingual-e5-large";

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
    // Retrieve Request Variables
    const { chatId, conversation, rag } = await request.json();

    let combinedContexts = "";

    if (rag) {
        // Connect to Pinecone
        const pc = new Pinecone({ apiKey: apiKey });

        // Connect to Pinecone index
        const index = pc.index(indexName);

        // Create text variable to embed
        const text = [conversation.at(-1).message];

        console.log(text);

        // Create embeddings
        const embeddings = await pc.inference.embed(model, text, {
            inputType: "passage",
        });
        const embedding = embeddings.data[0].values!;

        // Query from Pinecone
        const queryResponse = await index.query({
            topK: 3,
            vector: embedding,
            includeMetadata: true,
        });

        // Extract messages from response
        const contexts: string[] = [];
        queryResponse.matches.map(async (vector: any) => {
            contexts.push(vector.metadata!.text.toString());
        });

        // Combine contexts
        combinedContexts = contexts[0].concat(
            " ",
            contexts[1],
            " ",
            contexts[2]
        );
    }

    console.log(combinedContexts);

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/ConverseCommand/

    // Initialize AWS parameters
    const model_id = "mistral.mistral-7b-instruct-v0:2";
    const region = "us-east-1";

    // Connect to Posgresql db
    const clientPosgres = new Client({
        connectionString,
    });
    await clientPosgres.connect();

    // Query to insert data into db
    const setDialogueQuery =
        "insert into dialogue (chat_id, is_user, message, sequence) values ($1, $2, $3, $4);";

    // Add user input to db
    await clientPosgres.query(setDialogueQuery, [
        chatId,
        true,
        conversation.at(-1).message,
        conversation.length,
    ]);

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

    // Format input message with rag contexts
    const contextIntro =
        "Here are some contexts, which may or may not be helpful. Use the information here if it is related to the question.\n\nContexts: ";
    messages.at(-1).content.text =
        contextIntro +
        combinedContexts +
        "\n\nQuestion: " +
        messages.at(-1).content.text;

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

    // Add LLM output to conversation
    conversation.push({ is_user: false, message: message });

    // Insert LLM message into db
    await clientPosgres.query(setDialogueQuery, [
        chatId,
        false,
        message,
        conversation.length,
    ]);

    // End connection to postgresql db
    await clientPosgres.end();

    return NextResponse.json({
        chatId: chatId,
        conversation: conversation,
        success: true,
    });
}
