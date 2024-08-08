"use client";

import {
    Box,
    Typography,
    Button,
    Stack,
    Menu,
    MenuItem,
    TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { DoDisturb, Upload } from "@mui/icons-material";

import { test } from "@/pg";

interface Chat {
    title: string;
    uuid: string;
}

interface Dialogue {
    is_user: boolean;
    message: string;
}

export default function Home() {
    // Variable Handlers
    const [message, setMessage] = useState<string>("");
    const [chats, setChats] = useState<Chat[]>([
        { title: "How to eat watermellom", uuid: "ABCDEFG" },
        { title: "Drunk Driving", uuid: "FDLKDF" },
        { title: "Creating a Moltov Grenade with your toes", uuid: "ABCDEFG" },
    ]);
    const [conversation, setConversation] = useState<Dialogue[]>([]);

    // Get Dialogue
    const getDialogue = async () => {
        await fetch("/api/chat/getDialogue", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log("test");
                console.log(res.messages);
                setConversation(res.messages)
                console.log(conversation)
            });
    };

    useEffect(() => {
        getDialogue();
    }, [])

    // Invoke LLM
    const invoke = async () => {
        conversation.push({is_user: true, message: message})
        console.log(conversation)
        await fetch("/api/chat/invoke", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                conversation: conversation
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                setConversation(res.conversation)
            });
    };

    // Chat Menu Handlers
    const [auth, setAuth] = useState<boolean>(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            width={"100vw"}
            height={"calc(100vh - 60px)"}
            display={"flex"}
            flexDirection={"row"}
        >
            {/* SideBar */}
            <Box width={"280px"} height={"100%"} bgcolor={"grey"}>
                <Box>
                    <Stack gap={2} pt={2} ml={2} mr={2}>
                        {chats.map((chat) => (
                            <Box
                                display={"flex"}
                                justifyContent={"space-between"}
                            >
                                <Typography textOverflow={"ellipsis"} noWrap>
                                    {chat.title}
                                </Typography>
                                <Button onClick={handleMenu}>
                                    <DoDisturb></DoDisturb>
                                </Button>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem>Rename</MenuItem>
                                    <MenuItem>
                                        <Typography color={"red"}>
                                            Delete
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Box>
            {/* Chat */}
            <Box
                width={"calc(100vw - 280px)"}
                maxHeight={"calc(100vh - 60px)"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"column"}
            >
                <Stack
                    width={"80%"}
                    minHeight={"90%"}
                    bgcolor={"white"}
                    gap={2}
                    overflow={"auto"}
                    mb={1}
                >
                    {conversation.map((dialogue) => (
                        <Box
                            width={"100%"}
                            display={"flex"}
                            justifyContent={
                                dialogue.is_user
                                    ? "flex-end"
                                    : "flex-begin"
                            }
                        >
                            <Box
                                maxWidth={"80%"}
                                bgcolor={
                                    dialogue.is_user
                                        ? "lightgrey"
                                        : "grey"
                                }
                                borderRadius={5}
                                display={"flex"}
                                justifyContent={
                                    dialogue.is_user
                                        ? "flex-end"
                                        : "flex-begin"
                                }
                            >
                                <Typography
                                    margin={1}
                                    textAlign={
                                        dialogue.is_user
                                            ? "right"
                                            : "left"
                                    }
                                >
                                    {dialogue.message}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>
                <Box
                    width={"100%"}
                    display={"flex"}
                    justifyContent={"flex-end"}
                >
                    <Box
                        width={"70%"}
                        pr={4}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        gap={2}
                    >
                        <TextField
                            fullWidth
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                            }}
                        ></TextField>
                        <Button
                            onClick={() => {
                                setMessage("");
                                invoke();
                            }}
                        >
                            <Upload></Upload>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
