import { Box, Typography } from "@mui/material";

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
                <Typography ml={2} fontSize={32} color={"black"}>
                    Chatter
                </Typography>
            </Box>
            {children}
        </Box>
    );
}
