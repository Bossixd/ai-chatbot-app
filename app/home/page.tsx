"use client";

import {
    Box,
    Typography,
    Button,
    Stack,
    Menu,
    MenuItem,
    TextField,
    Link,
} from "@mui/material";
import { useState, useEffect } from "react";
import { MoreVertRounded, Upload } from "@mui/icons-material";

import { test } from "@/pg";

interface Chat {
    title: string;
    chat_id: string;
}

interface Dialogue {
    is_user: boolean;
    message: string;
}

export default function Home() {
    // Variable Handlers
    const [message, setMessage] = useState<string>("");
    const [chats, setChats] = useState<Chat[]>([]);
    const [conversation, setConversation] = useState<Dialogue[]>([]);

    const [currentChatId, setCurrentChatId] = useState<string>("");

    // Get Dialogue
    const getDialogue = async (chatId: string) => {
        await fetch("/api/chat/getDialogue", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chatId: chatId,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                setConversation(res.messages);
            });
    };

    // Get Dialogue
    const getChat = async () => {
        await fetch("/api/chat/getChat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
            .then((res) => res.json())
            .then((res) => {
                setChats(res.chats);
            });
    };

    useEffect(() => {
        getChat();
    }, []);

    // Invoke LLM
    const invoke = async (chatId: string) => {
        conversation.push({ is_user: true, message: message });
        if (chatId == "") {
            fetch("/api/chat/createChat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatId: chatId,
                    conversation: conversation,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    setCurrentChatId(res.chatId);
                    return fetch("/api/chat/invoke", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            chatId: res.chatId,
                            conversation: conversation,
                        }),
                    });
                })
                .then((res) => res.json())
                .then((res) => {
                    setConversation(res.conversation);
                    return fetch("/api/chat/setChatName", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            chatId: res.chatId,
                            conversation: res.conversation,
                        }),
                    });
                })
                .then((res) => {
                    getChat();
                });
        } else {
            await fetch("/api/chat/invoke", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatId: currentChatId,
                    conversation: conversation,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    setConversation(res.conversation);
                });
        }
    };

    // Delete Chat
    const deleteChat = async (chatId: string) => {
        if (chatId == currentChatId) {
            setConversation([]);
            setCurrentChatId("");
        }
        await fetch("/api/chat/deleteChat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chatId: chatId,
            }),
        }).then((res) => getChat());
    };

    // Chat Menu Handlers
    const [auth, setAuth] = useState<boolean>(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openIndex, setOpenIndex] = useState(-1);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (
        event: React.MouseEvent<HTMLElement>,
        index: number
    ) => {
        setAnchorEl(event.currentTarget);
        setOpenIndex(index);
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
                        {chats.map((chat, index) => (
                            <Box
                                key={index}
                                display={"flex"}
                                justifyContent={"space-between"}
                            >
                                <Typography
                                    onClick={() => {
                                        setCurrentChatId(chat.chat_id);
                                        getDialogue(chat.chat_id);
                                    }}
                                    textOverflow={"ellipsis"}
                                    noWrap
                                >
                                    {chat.title}
                                </Typography>
                                <Button
                                    sx={{ color: "black" }}
                                    onClick={(e) => handleMenu(e, index)}
                                >
                                    <MoreVertRounded></MoreVertRounded>
                                </Button>
                                <Menu
                                    id={chat.chat_id}
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
                                    open={
                                        Boolean(anchorEl) && index === openIndex
                                    }
                                    onClose={handleClose}
                                >
                                    <MenuItem>Rename</MenuItem>
                                    <MenuItem
                                        onClick={(e) => {
                                            deleteChat(chat.chat_id);
                                        }}
                                    >
                                        <Typography color={"red"}>
                                            Delete
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        ))}
                        <Box display={"flex"} justifyContent={"space-between"}>
                            <Typography
                                onClick={() => {
                                    setCurrentChatId("");
                                    setConversation([]);
                                }}
                                textOverflow={"ellipsis"}
                                noWrap
                            >
                                Create New Chat
                            </Typography>
                        </Box>
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
                    {conversation.map((dialogue, index) => (
                        <Box
                            key={index}
                            width={"100%"}
                            display={"flex"}
                            justifyContent={
                                dialogue.is_user ? "flex-end" : "flex-begin"
                            }
                        >
                            <Box
                                maxWidth={"80%"}
                                bgcolor={
                                    dialogue.is_user ? "lightgrey" : "grey"
                                }
                                borderRadius={5}
                                display={"flex"}
                                justifyContent={
                                    dialogue.is_user ? "flex-end" : "flex-begin"
                                }
                            >
                                <Typography
                                    margin={1}
                                    textAlign={
                                        dialogue.is_user ? "right" : "left"
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
                                invoke(currentChatId);
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
