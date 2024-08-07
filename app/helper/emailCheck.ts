"use server";

export default async function emailCheck(email: string) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
