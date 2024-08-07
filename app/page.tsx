"use client";

import { Box, Typography, Button } from "@mui/material";
import navigate from "./helper/navigate";

export default function Home() {
    return (
        <Box height={"100vh"} width={"100vw"}>
            {/* Header */}
            <Box
                height={"60px"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Typography ml={2} fontSize={32}>
                    Chatter
                </Typography>
                <Box mr={2}>
                    <Button onClick={() => navigate("/auth/login")}>Login</Button>
                </Box>
            </Box>
            {/* Body */}
            <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                height={"75%"}
                width={"100%"}
            >
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                >
                    <Typography fontSize={80}>
                        Your Personalized Assistant
                    </Typography>
                    <Box mr={2}>
                        <Button onClick={() => navigate("/home")}>
                            <Typography fontSize={24}>Get Started!</Typography>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
