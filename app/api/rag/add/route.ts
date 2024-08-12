"use server";

import { NextRequest, NextResponse } from "next/server";

import { featureExtraction } from "@huggingface/inference";

import { Pinecone } from "@pinecone-database/pinecone";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import fs from "fs";
import path from "path";

const apiKey: string = process.env.PINECONE_API_KEY!;

export async function POST(request: NextRequest) {
    const dir = "public/data";
    const files = fs.readdirSync(dir);

    for (const file of files) {
        let filePath = path.join(dir, file);
        fs.readFile(filePath, async (err, dataRaw) => {
            if (err) throw err;
            const data = dataRaw.toString();

            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 250,
                chunkOverlap: 1,
                separators: ["\n\n", "\n", " ", ""],
            });

            const splits = await splitter.createDocuments([data]);

            for (const chunk of splits) {
                // TODO Continue working on RAG with AWS Dataset
                const embedding = await featureExtraction({
                    model: "intfloat/multilingual-e5-large",
                    inputs: chunk.pageContent,
                });
                console.log(embedding);
                break;
            }
        });
        break;
    }

    // function searchFile(dir, fileName) {
    //     // read the contents of the directory
    //     const files = fs.readdirSync(dir);

    //     // search through the files
    //     for (const file of files) {
    //         // build the full path of the file
    //         const filePath = path.join(dir, file);

    //         // get the file stats
    //         const fileStat = fs.statSync(filePath);

    //         // if the file is a directory, recursively search the directory
    //         if (fileStat.isDirectory()) {
    //             searchFile(filePath, fileName);
    //         } else if (file.endsWith(fileName)) {
    //             // if the file is a match, print it
    //             console.log(filePath);
    //         }
    //     }
    // }

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
