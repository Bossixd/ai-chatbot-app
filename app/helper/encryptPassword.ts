"use server";

import bcrypt from "bcrypt";

const saltRounds: number = Number(process.env.SALT_ROUNDS);

export default async function encryptPassword(password: string): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error encrypting password");
    }
};
