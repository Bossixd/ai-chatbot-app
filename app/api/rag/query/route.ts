"use server";

import { NextRequest, NextResponse } from "next/server";

import { featureExtraction } from "@huggingface/inference";

import { Pinecone } from "@pinecone-database/pinecone";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import fs from "fs";
import path from "path";

const apiKey: string = process.env.PINECONE_API_KEY!;

const indexName = "aws-case-studies-and-blogs";
const model = "multilingual-e5-large";

async function generateDocEmbeddings(pc: Pinecone, text: string[]) {
    try {
        return await pc.inference.embed(model, text, {
            inputType: "passage",
            truncate: "END",
        });
    } catch (error) {
        console.error("Error generating embeddings:", error);
    }
}

export async function POST(request: NextRequest) {
    const promise = new Promise<string[]>(async (resolve, reject) => {
        const pc = new Pinecone({ apiKey: apiKey });

        const index = pc.index(indexName);

        const text = [
            "What are the 21 startups AWS selected for the AWS generative AI accelerator",
        ];

        const embeddings = await pc.inference.embed(model, text, {
            inputType: "passage",
        });
        console.log(embeddings);

        const embedding = embeddings.data[0].values!;

        console.log(embedding);

        const queryResponse = await index.query({
            topK: 3,
            vector: embedding,
            includeMetadata: true,
        });

        const contexts: string[] = [];

        queryResponse.matches.map(async (vector) => {
            contexts.push(vector.metadata!.text.toString());
        });

        resolve(contexts);
    });

    return NextResponse.json({
        success: true,
        result: promise,
    });
}
