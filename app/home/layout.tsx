"use client";

import { useState } from "react";

import {
    Box,
    Typography,
    IconButton,
    Button,
    Menu,
    MenuItem,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { logout } from "../helper/auth";
import navigate from "../helper/navigate";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
        <Box>
            {/* Header */}
            <Box
                height={"60px"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Typography ml={2} fontSize={32} color={"black"} onClick={() => navigate("/")}>
                    Chatter
                </Typography>
                <IconButton
                    onClick={handleMenu}
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
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
                    <MenuItem>Profile</MenuItem>
                    <MenuItem
                        onClick={() => {
                            logout();
                            navigate("/auth/logout");
                        }}
                    >
                        <Typography color={"red"}>Log out</Typography>
                    </MenuItem>
                </Menu>
            </Box>
            {children}
        </Box>
    );
}
