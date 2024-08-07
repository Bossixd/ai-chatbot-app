"use server";

import { compare } from "bcrypt";

export default async function passwordCheck(
    userPassword: string,
    storedPassword: string
) {
    const res = await new Promise<boolean>((resolve, reject) => {
        compare(userPassword, storedPassword, (err, result) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                reject(false);
            } else {
                resolve(result);
            }
        });
    });
    return res;
}
