"use server";

import pg from "pg";

const { Pool, Client } = pg;
const connectionString = process.env.DB_URL;

export async function test() {
    console.log(connectionString);
    const client = new Client({
        connectionString,
    });
    await client.connect();
    console.log("test");
    const test = await client.query("SELECT NOW()");
    console.log(test.rows)
    await client.end();
    return test.rows;
}
