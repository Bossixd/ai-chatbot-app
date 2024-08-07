import { Box, Typography, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

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
                <Box mr={1}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                </Box>
            </Box>
            {children}
        </Box>
    );
}
