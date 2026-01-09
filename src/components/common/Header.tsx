import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { COLORS } from "../../theme/colors";

export default function Header() {
    const navItems = [
        { label: "Map", path: "/" },
        { label: "About", path: "/about" },
    ];

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                borderBottom: "1px solid #eee",
                backgroundColor: "transparent",
                color: "inherit",
            }}
        >
            <Toolbar sx={{ px: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, color: COLORS.primary }}>
                    <Typography variant="h5" fontWeight="bold">
                        ACAI-US79
                    </Typography>
                    <Typography variant="body2">
                        An interactive map of how universities are responding to AI.
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    {navItems.map((item) => (
                        <Button
                            size="large"
                            key={item.path}
                            component={RouterLink}
                            to={item.path}
                            variant="text"
                            color="primary"
                            sx={{
                                textTransform: "none",
                                px: 2,
                                py: 0.5,
                                minWidth: 80,
                                borderRadius: 1,
                                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
