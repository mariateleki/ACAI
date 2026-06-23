import { Box, Typography, Link } from "@mui/material"

function Footer() {
    return (
        <Box sx={{
            padding: "10px",
            textAlign: "center",
            borderTop: "1px solid #eee"
        }}>
            <Typography variant="body2">
                Data Source:{" "}
                <Link
                    href="https://docs.google.com/spreadsheets/d/1Bray6jqxibUUf3dWeYroHWRGaU2faLlpWtHW164GY0I/edit?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    underline="hover"
                >
                    Google Sheet
                </Link>
                {" · "}
                <Link href="/#/about" underline="hover">
                    About & Feedback
                </Link>
                {" · "}
                Contact:{" "}
                <Link href="mailto:mariateleki@tamu.edu?subject=%5BACAI%5D" underline="hover">
                mariateleki@tamu.edu
                </Link>
            </Typography>
        </Box>
    )
}

export default Footer