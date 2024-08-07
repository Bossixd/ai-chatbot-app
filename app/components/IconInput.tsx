import { Box, Typography, InputAdornment, TextField } from "@mui/material";

interface IconInputProps {
    name: string;
    placeholder: string;
    icon?: any;
    value: string | number;
    callback: any;
    password?: boolean
}

export default function IconInput({
    name,
    placeholder,
    icon,
    value,
    callback,
    password=false
}: IconInputProps) {
    let type = "standard";
    if (password)
        type = "password";
    return (
        <Box mt={2} mb={2}>
            <Typography fontFamily={"Poppins"} fontWeight={300}>
                {name}
            </Typography>
            <Box display={"flex"} flexDirection={"row"} alignItems={"flex-end"}>
                <TextField
                    id="input-with-icon-textfield"
                    placeholder={placeholder}
                    fullWidth
                    value={value}
                    onChange={(e) => {
                        if (typeof value === "number")
                            callback(Number(e.target.value));
                        else callback(e.target.value);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                {icon}
                            </InputAdornment>
                        ),
                    }}
                    variant="standard"
                    type={type}
                />
            </Box>
        </Box>
    );
}
