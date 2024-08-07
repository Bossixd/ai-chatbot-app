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
import { useState } from "react";
import { DoDisturb, Upload } from "@mui/icons-material";

import {test} from "@/pg"

interface Chat {
    title: string;
    uuid: string;
}

interface Conversation {
    user: string;
    text: string;
}

export default function Home() {
    // Variable Handlers
    const [message, setMessage] = useState<string>("");
    const [chats, setChats] = useState<Chat[]>([
        { title: "How to eat watermellom", uuid: "ABCDEFG" },
        { title: "Drunk Driving", uuid: "FDLKDF" },
        { title: "Creating a Moltov Grenade with your toes", uuid: "ABCDEFG" },
    ]);
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            user: "user",
            text: "Lorem insum asdf sd fs dfasdfasd asdfasdf sdfsdf sdfsdf sdfsdf sdfsdf. sdfasdf, sdfsdf sdfsdfsd,f sdfjsd fsd fsdf.sdfs dfsdfs dfsdfsd fsdfs dfsdfs dfsdf adfasd fsdfas dfasdfas sdfadsf.",
        },
        {
            user: "assistant",
            text: "Lorem insum asdf sd fs dfasdfasd asdfasdf sdfsdf sdfsdf sdfsdf sdfsdf. sdfasdf, sdfsdf sdfsdfsd,f sdfjsd fsd fsdf.sdfs dfsdfs dfsdfsd fsdfs dfsdfs dfsdf adfasd fsdfas dfasdfas sdfadsf.",
        },
        {
            user: "user",
            text: "Lorem insum asdf sd fs dfasdfasd asdfasdf sdfsdf sdfsdf sdfsdf sdfsdf. sdfasdf, sdfsdf sdfsdfsd,f sdfjsd fsd fsdf.sdfs dfsdfs dfsdfsd fsdfs dfsdfs dfsdf adfasd fsdfas dfasdfas sdfadsf.",
        },
        {
            user: "assistant",
            text: "Lorem insum asdf sd fs dfasdfasd asdfasdf sdfsdf sdfsdf sdfsdf sdfsdf. sdfasdf, sdfsdf sdfsdfsd,f sdfjsd fsd fsdf.sdfs dfsdfs dfsdfsd fsdfs dfsdfs dfsdf adfasd fsdfas dfasdfas sdfadsf.",
        },
        {
            user: "user",
            text: "Lorem insum asdf sd fs dfasdfasd asdfasdf sdfsdf sdfsdf sdfsdf sdfsdf. sdfasdf, sdfsdf sdfsdfsd,f sdfjsd fsd fsdf.sdfs dfsdfs dfsdfsd fsdfs dfsdfs dfsdf adfasd fsdfas dfasdfas sdfadsf.",
        },
        {
            user: "assistant",
            text: "Lorem insum asdf sd fs dfasdfasd asdfasdf sdfsdf sdfsdf sdfsdf sdfsdf. sdfasdf, sdfsdf sdfsdfsd,f sdfjsd fsd fsdf.sdfs dfsdfs dfsdfsd fsdfs dfsdfs dfsdf adfasd fsdfas dfasdfas sdfadsf.",
        },
        {
            user: "user",
            text: "Lorem insum asdf sd fs dfasdfasd asdfasdf sdfsdf sdfsdf sdfsdf sdfsdf. sdfasdf, sdfsdf sdfsdfsd,f sdfjsd fsd fsdf.sdfs dfsdfs dfsdfsd fsdfs dfsdfs dfsdf adfasd fsdfas dfasdfas sdfadsf.",
        },
        // {
        //     user: "assistant",
        //     text: "Lorem insum asdf sd fs dfasdfasd asdfasdf sdfsdf sdfsdf sdfsdf sdfsdf. sdfasdf, sdfsdf sdfsdfsd,f sdfjsd fsd fsdf.sdfs dfsdfs dfsdfsd fsdfs dfsdfs dfsdf adfasd fsdfas dfasdfas sdfadsf.",
        // },
        // {
        //     user: "user",
        //     text: "Lorem insum asdf sd fs dfasdfasd asdfasdf sdfsdf sdfsdf sdfsdf sdfsdf. sdfasdf, sdfsdf sdfsdfsd,f sdfjsd fsd fsdf.sdfs dfsdfs dfsdfsd fsdfs dfsdfs dfsdf adfasd fsdfas dfasdfas sdfadsf.",
        // },
        // {
        //     user: "assistant",
        //     text: "Lorem insum asdf sd fs dfasdfasd asdfasdf sdfsdf sdfsdf sdfsdf sdfsdf. sdfasdf, sdfsdf sdfsdfsd,f sdfjsd fsd fsdf.sdfs dfsdfs dfsdfsd fsdfs dfsdfs dfsdf adfasd fsdfas dfasdfas sdfadsf.",
        // },
    ]);

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
                                    <DoDisturb fontSize="20"></DoDisturb>
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
                    {conversations.map((conversation) => (
                        <Box
                            width={"100%"}
                            display={"flex"}
                            justifyContent={
                                conversation.user == "user"
                                    ? "flex-end"
                                    : "flex-begin"
                            }
                        >
                            <Box
                                maxWidth={"80%"}
                                bgcolor={
                                    conversation.user == "user"
                                        ? "lightgrey"
                                        : "grey"
                                }
                                borderRadius={5}
                                display={"flex"}
                                justifyContent={
                                    conversation.user == "user"
                                        ? "flex-end"
                                        : "flex-begin"
                                }
                            >
                                <Typography
                                    margin={1}
                                    textAlign={
                                        conversation.user == "user"
                                            ? "right"
                                            : "left"
                                    }
                                >
                                    {conversation.text}
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
                        <Button onClick={() => {
                            setMessage("")
                        }}>
                            <Upload></Upload>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
