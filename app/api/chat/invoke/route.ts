"use server";
import { NextResponse } from "next/server";

export async function POST() {
    const response = new Promise<boolean>((resolve, reject) => {
        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "recursal/eagle-7b",
                messages: [
                    { role: "user", content: "What is the meaning of life? Reply within 5 sentences." },
                ],
            }),
        })
            .then((response) => {
                console.log(response);
                return response.text();
            })
            .then((data) => {
                const jsonData = JSON.parse(data)
                console.log(data)
                console.log(jsonData)
                console.log(jsonData.choices)
                console.log(jsonData.choices[0].message.content)
                resolve(jsonData.choices[0].message.content)
            });
    });

    return NextResponse.json({
        message: response
    });
}
