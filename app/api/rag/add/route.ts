"use server";

import { NextRequest, NextResponse } from "next/server";

import { featureExtraction } from "@huggingface/inference";

import { Pinecone } from "@pinecone-database/pinecone";

const apiKey: string = process.env.PINECONE_API_KEY!;

export async function POST(request: NextRequest) {
    const result = await featureExtraction({
        model: "intfloat/multilingual-e5-large",
        inputs: "test",
    });
    console.log(result);
    // const pc = new Pinecone({ apiKey: apiKey });
    // const indexName = "aws-case-studies-and-blogs";

    // const index = pc.index(indexName);

    // const stats = await index.describeIndexStats();

    // console.log(stats);

    // await index.namespace("ns1").upsert([
    //     {
    //         id: "vec1",
    //         values: [1.0, 1.5],
    //     },
    //     {
    //         id: "vec2",
    //         values: [2.0, 1.0],
    //     },
    //     {
    //         id: "vec3",
    //         values: [0.1, 3.0],
    //     },
    // ]);

    // await index.namespace("ns2").upsert([
    //     {
    //         id: "vec1",
    //         values: [1.0, -2.5],
    //     },
    //     {
    //         id: "vec2",
    //         values: [3.0, -2.0],
    //     },
    //     {
    //         id: "vec3",
    //         values: [0.5, -1.5],
    //     },
    // ]);

    return NextResponse.json({
        success: true,
    });
}
