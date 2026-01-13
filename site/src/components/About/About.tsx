import { Box, Typography, Link, Divider, List, ListItem, ListItemText } from "@mui/material";

const About = () => {
    return (
        <Box sx={{
            px: 4,
            py: 4,
            overflow: "auto",
            maxWidth: 900,
            mx: "auto",
            width: "100%",
        }}>
            {/* About */}
            <Typography variant="h4" gutterBottom>
                About This Map
            </Typography>

            <Typography variant="body1">
                This interactive map visualizes selected U.S. universities and their
                publicly available policies, guidelines, and resources related to
                artificial intelligence (AI), including governance, teaching,
                research, and institutional initiatives.
            </Typography>

            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>
                Scope & Limitations
            </Typography>

            <List dense>
                <ListItem>
                    <ListItemText primary="The map focuses on research-oriented institutions and is not exhaustive." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="All information is collected from publicly accessible university websites." />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Policies and links may change over time and may not always be up to date." />
                </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Data Source */}
            <Typography variant="h5" gutterBottom>
                Data Source
            </Typography>

            <List dense>
                <ListItem>
                    <ListItemText
                        primary={
                            <>
                                Original Dataset:&nbsp;
                                <Link
                                    href="https://docs.google.com/spreadsheets/d/1Bray6jqxibUUf3dWeYroHWRGaU2faLlpWtHW164GY0I/edit?usp=sharing"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View spreadsheet
                                </Link>
                            </>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Last updated: January 2026" />
                </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Feedback */}
            <Typography variant="h5" gutterBottom>
                Feedback & Contributions
            </Typography>

            <Typography variant="body1">
                Corrections, new links, and suggestions are welcome.
            </Typography>

            <List dense>
                <ListItem>
                    <ListItemText primary={
                        <>Email: <Link href="mailto:redacted@redacted.redacted" target="_blank" rel="noreferrer">
                            redacted@redacted.redacted
                        </Link></>
                    }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={
                            <>
                                Google Form:&nbsp;
                                <Link href="YOUR_FORM_LINK" target="_blank" rel="noreferrer">
                                    Submit feedback
                                </Link>
                            </>
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={
                            <>
                                GitHub Issues:&nbsp;
                                <Link href="YOUR_GITHUB_LINK" target="_blank" rel="noreferrer">
                                    Report an issue
                                </Link>
                            </>
                        }
                    />
                </ListItem>
            </List>
        </Box>
    );
};

export default About;