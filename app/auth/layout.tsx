"use client";

import { Box, Typography } from "@mui/material";
import navigate from "../helper/navigate";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Box>
            {/* Header */}
            <Box
                height={"60px"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Typography
                    ml={2}
                    fontSize={32}
                    color={"black"}
                    onClick={() => navigate("/")}
                >
                    Chatter
                </Typography>
            </Box>
            {children}
        </Box>
    );
}
