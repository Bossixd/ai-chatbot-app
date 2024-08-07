"use client";

import { useState } from "react";

import { Box, Typography, Button, Link } from "@mui/material";
import IconInput from "@/app/components/IconInput";
import { Mail, Lock } from "@mui/icons-material";

import navigate from "@/app/helper/navigate";

import "@fontsource/poppins/500.css";

export default function Home() {
    // Variable Handlers
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [errorMessage, setErrorMessage] = useState<string>("");

    // Login Function
    const login = async () => {
        await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (!res.success) {
                    setErrorMessage(res.reason);
                    setPassword("");
                } else {
                    navigate("/home");
                }
            });
    };

    return (
        <Box
            height={"80vh"}
            width={"100vw"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
        >
            <Box
                height={"80%"}
                width={"100%"}
                maxWidth={"500px"}
                bgcolor={"lightgrey"}
                borderRadius={3}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
            >
                <Typography mt={2} fontSize={32} fontWeight={500} fontFamily={"Poppins"}>Login</Typography>
                <Typography color={"red"}>{errorMessage}</Typography>
                <IconInput
                    name="Email"
                    placeholder="Type your Email"
                    icon={<Mail />}
                    value={email}
                    callback={setEmail}
                />
                <IconInput
                    name="Password"
                    placeholder="Type your Password"
                    icon={<Lock />}
                    value={password}
                    callback={setPassword}
                />
                <Button onClick={() => login()}>Login</Button>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    marginBottom={0}
                    paddingTop={"33%"}
                >
                    <Typography
                        color={"gray"}
                        fontWeight={300}
                        fontFamily={"Poppins"}
                    >
                        Or Sign Up Using
                    </Typography>
                    <Link
                        mt={1}
                        href="/auth/signup"
                        underline="none"
                        color="grey"
                    >
                        SIGN UP
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}
