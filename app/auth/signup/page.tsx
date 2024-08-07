"use client";

import { useState } from "react";

import navigate from "@/app/helper/navigate";

import { Box, Typography, Button, Link } from "@mui/material";
import IconInput from "@/app/components/IconInput";
import { Mail, Lock } from "@mui/icons-material";

import "@fontsource/poppins/500.css";

export default function Home() {
    // Variable Handlers
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [errorMessage, setErrorMessage] = useState<string>("");

    const [pageNumber, setPageNumber] = useState<number>(0);

    // Sign Up Function
    const submit = async () => {
        await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
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
                    navigate("/auth/login");
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
                <Typography
                    mt={2}
                    fontSize={32}
                    fontWeight={500}
                    fontFamily={"Poppins"}
                >
                    Sign Up
                </Typography>
                <Typography color={"red"}>{errorMessage}</Typography>
                {pageNumber == 0 && (
                    <Box>
                        <IconInput
                            name="Firstname"
                            placeholder="Type your Firstname"
                            icon={<Mail />}
                            value={firstname}
                            callback={setFirstname}
                        />
                        <IconInput
                            name="Lastname"
                            placeholder="Type your Lastname"
                            icon={<Lock />}
                            value={lastname}
                            callback={setLastname}
                        />
                        <Box display={"flex"} justifyContent={"flex-end"}>
                            <Button
                                onClick={() => {
                                    if (!firstname)
                                        setErrorMessage(
                                            "Please fill in your first name!"
                                        );
                                    else if (!lastname)
                                        setErrorMessage(
                                            "Please fill in your last name!"
                                        );
                                    else {
                                        setErrorMessage("");
                                        setPageNumber(1);
                                    }
                                }}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                )}
                {pageNumber == 1 && (
                    <Box>
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
                            password={true}
                        />
                        <Box display={"flex"} justifyContent={"space-between"}>
                            <Button
                                sx={{ bgColor: "red" }}
                                onClick={() => {
                                    setPageNumber(0);
                                    setErrorMessage("");
                                }}
                            >
                                Back
                            </Button>
                            <Button
                                onClick={() => {
                                    if (!email)
                                        setErrorMessage(
                                            "Please fill in your email!"
                                        );
                                    else if (!password)
                                        setErrorMessage(
                                            "Please fill in your password!"
                                        );
                                    else submit();
                                }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                )}
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
                        Already have an Account?
                    </Typography>
                    <Link
                        mt={1}
                        href="/auth/login"
                        underline="none"
                        color="grey"
                    >
                        LOGIN
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}

function NameInput(props: any) {
    return (
        <Box>
            <IconInput
                name="Firstname"
                placeholder="Type your Firstname"
                icon={<Mail />}
                value={props.firstname}
                callback={props.setFirstname}
            />
            <IconInput
                name="Lastname"
                placeholder="Type your Lastname"
                icon={<Lock />}
                value={props.lastname}
                callback={props.setLastname}
            />
            <Box display={"flex"} justifyContent={"flex-end"}>
                <Button
                    onClick={() => {
                        props.updatePage(1);
                    }}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
}

function EmailPasswordInput(props: any) {
    return (
        <Box>
            <IconInput
                name="Email"
                placeholder="Type your Email"
                icon={<Mail />}
                value={props.email}
                callback={props.setEmail}
            />
            <IconInput
                name="Password"
                placeholder="Type your Password"
                icon={<Lock />}
                value={props.password}
                callback={props.setPassword}
            />
            <Box display={"flex"} justifyContent={"space-between"}>
                <Button
                    sx={{ bgColor: "red" }}
                    onClick={() => {
                        props.updatePage(-1);
                    }}
                >
                    Back
                </Button>
                <Button
                    onClick={() => {
                        props.updatePage(1);
                    }}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    );
}
