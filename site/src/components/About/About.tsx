import {
    Box,
    Typography,
    Link,
    Divider,
    Paper,
    Stack,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionIcon from "@mui/icons-material/Description";
import GitHubIcon from "@mui/icons-material/GitHub";
import TableChartIcon from "@mui/icons-material/TableChart";
import BugReportIcon from "@mui/icons-material/BugReport";
import { Link as RouterLink } from "react-router-dom";

const pillSx = (bg: string, fg: string) => ({
    display: "inline-block",
    backgroundColor: bg,
    color: fg,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    fontSize: "0.8125rem",
    lineHeight: 1.75,
    letterSpacing: "0.02857em",
    textTransform: "uppercase" as const,
    px: 1,
    py: 0.25,
    borderRadius: 1,
    border: "1px solid rgba(0,0,0,0.12)",
    verticalAlign: "baseline",
});

const BIBTEX = `@inproceedings{teleki2026dueprocess,
  author    = {Teleki, Maria and Choi, Anna Seo Gyeong and Duray, Anne and Liu, Haoran and Zhang, Junyan and Dong, Xiangjue and Da Silva, Dilma and Koenecke, Allison and Caverlee, James},
  title     = {The Due Process Deficit: Auditing {AI} Governance in {U.S.} Higher Education},
  booktitle = {Proc. 2026 ACM Conference on Fairness, Accountability, and Transparency (FAccT '26)},
  year      = {2026},
  publisher = {ACM},
  doi       = {10.1145/3805689.3812328}
}`;

const DOMAINS: {
    key: string;
    title: string;
    color: string;
    blurb: string;
    indicators: { id: string; text: string }[];
}[] = [
    {
        key: "A",
        title: "A. Policy Clarity",
        color: "#4C72B0",
        blurb: "Can affected parties identify the rules?",
        indicators: [
            { id: "A1", text: "The university defines “AI use,” “AI assistance,” or “AI-generated content.”" },
            { id: "A2", text: "The university defines standards for citing AI-generated material." },
        ],
    },
    {
        key: "B",
        title: "B. Faculty Support",
        color: "#55A868",
        blurb: "Do faculty have the institutional support to apply them consistently?",
        indicators: [
            { id: "B1", text: "The university provides guidance, training, or resources for faculty on AI-related teaching practices." },
            { id: "B2", text: "Official examples of appropriate and/or prohibited AI use are provided (e.g. example AI use cases, example prompts)." },
            { id: "B3", text: "A faculty committee or group focused on teaching and learning about AI exists." },
            { id: "B4", text: "Faculty are offered syllabus language examples (e.g. use AI/don’t use AI/selectively use AI)." },
        ],
    },
    {
        key: "C",
        title: "C. Feedback Mechanisms",
        color: "#C44E52",
        blurb: "Are there structured mechanisms for participation and revision?",
        indicators: [
            { id: "C1", text: "A faculty committee or advisory group focused on university AI policy or governance exists." },
            { id: "C2", text: "A student committee or advisory group focused on university AI policy or governance exists." },
            { id: "C3", text: "The university publishes AI policy update logs or explains revisions." },
        ],
    },
    {
        key: "D",
        title: "D. Detection Tools",
        color: "#8172B2",
        blurb: "Are AI-detection uses governed by safeguards against error and abuse?",
        indicators: [
            { id: "D1", text: "The university restricts, discourages, or warns against the use of AI detection tools." },
            { id: "D2", text: "Student misconduct determinations require human review and cannot be based solely on AI detection tools." },
        ],
    },
];

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
            {/* Header */}
            <Typography variant="h4" gutterBottom>
                About ACAI-US79
            </Typography>

            <Typography variant="body1" sx={{ mb: 1.5 }}>
                This site accompanies our FAccT &rsquo;26 paper,{" "}
                <em>The Due Process Deficit: Auditing AI Governance in U.S. Higher
                Education</em>. We audit how 79 U.S. universities are governing AI on campus,
                scoring each institution against 11 indicators across four governance domains
                using only publicly available materials. The result is an interpretable{" "}
                <strong>Academic AI Capacity Index (ACAI)</strong>.
            </Typography>

            <Typography variant="body1">
                Browse the{" "}
                <Link component={RouterLink} to="/">
                    interactive map
                </Link>
                , score your own institution with the{" "}
                <Link component={RouterLink} to="/calculator">
                    self-scoring calculator
                </Link>
                , or grab the paper, code, and data from the resources below.
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Resources */}
            <Typography variant="h5" gutterBottom>
                Resources
            </Typography>

            <Stack
                direction="row"
                spacing={1.5}
                useFlexGap
                flexWrap="wrap"
                sx={{ mb: 1 }}
            >
                <Button
                    variant="outlined"
                    startIcon={<DescriptionIcon />}
                    component="a"
                    href="https://mariateleki.github.io/pdf/FAccT_26_ACAI.pdf"
                    target="_blank"
                    rel="noreferrer"
                    sx={{ textTransform: "none" }}
                >
                    Paper (PDF)
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<GitHubIcon />}
                    component="a"
                    href="https://github.com/mariateleki/ACAI"
                    target="_blank"
                    rel="noreferrer"
                    sx={{ textTransform: "none" }}
                >
                    Code &amp; data
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<TableChartIcon />}
                    component="a"
                    href="https://docs.google.com/spreadsheets/d/1Bray6jqxibUUf3dWeYroHWRGaU2faLlpWtHW164GY0I/edit?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    sx={{ textTransform: "none" }}
                >
                    Annotated dataset
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<BugReportIcon />}
                    component="a"
                    href="https://github.com/mariateleki/ACAI/issues"
                    target="_blank"
                    rel="noreferrer"
                    sx={{ textTransform: "none" }}
                >
                    Report an issue
                </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary">
                Dataset is a snapshot from January 2026.
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* The audit framework */}
            <Typography variant="h5" gutterBottom>
                The Audit Framework
            </Typography>

            <Typography variant="body1" sx={{ mb: 1.5 }}>
                ACAI organizes governance around four procedural questions. Each of the 11
                indicators is scored independently: for every indicator, an annotator spends up
                to five minutes reviewing publicly accessible institutional materials and rates
                the supporting evidence as{" "}
                <Box component="span" sx={pillSx("#FDECEA", "#B71C1C")}>❌ Absent</Box> (0.0),{" "}
                <Box component="span" sx={pillSx("#FFF8E1", "#8D6708")}>➖ Partial</Box> (0.5), or{" "}
                <Box component="span" sx={pillSx("#E8F5E9", "#2E7D32")}>✅ Present</Box> (1.0).
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Click a domain to see its indicators.
            </Typography>

            <Stack spacing={1.5} sx={{ mb: 2 }}>
                {DOMAINS.map((d) => (
                    <Accordion
                        key={d.key}
                        disableGutters
                        elevation={0}
                        sx={{
                            border: "1px solid rgba(0,0,0,0.12)",
                            borderLeft: `4px solid ${d.color}`,
                            borderRadius: 1,
                            "&:before": { display: "none" },
                            backgroundColor: "transparent",
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: d.color }} />}
                            sx={{ px: 1.75, py: 0.5 }}
                        >
                            <Box>
                                <Typography sx={{ color: d.color, fontWeight: 500 }}>
                                    {d.title}{" "}
                                    <Box
                                        component="span"
                                        sx={{
                                            color: "text.secondary",
                                            fontWeight: 400,
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        ({d.indicators.length} indicator
                                        {d.indicators.length > 1 ? "s" : ""})
                                    </Box>
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: d.color, fontStyle: "italic", opacity: 0.85 }}
                                >
                                    {d.blurb}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 1.75, pt: 0, pb: 1.5 }}>
                            <Divider sx={{ mb: 1.5, borderColor: d.color, opacity: 0.3 }} />
                            <Stack spacing={1}>
                                {d.indicators.map((i) => (
                                    <Typography key={i.id} variant="body2">
                                        <Box
                                            component="span"
                                            sx={{ color: d.color, fontWeight: 500, mr: 0.75 }}
                                        >
                                            {i.id}.
                                        </Box>
                                        {i.text}
                                    </Typography>
                                ))}
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Stack>

            <Typography variant="body2" color="text.secondary">
                Indicator scores are aggregated under four weighting schemes (equal,
                indicator-weighted, policy-heavy, and teaching-heavy). The paper details the
                full rubric and robustness checks.
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Get involved */}
            <Typography variant="h5" gutterBottom>
                Get Involved
            </Typography>

            <Typography variant="body1">
                ACAI is meant to be re-audited, contested, and extended.
                If you&rsquo;ve found a stale link, want to dispute how an indicator was scored,
                or have an institution or extension to propose, email{" "}
                <Link href="mailto:mariateleki@tamu.edu?subject=%5BACAI%5D" target="_blank" rel="noreferrer">
                    mariateleki@tamu.edu
                </Link>{" "}
                with subject <code>[ACAI]</code>, or{" "}
                <Link href="mailto:mariateleki@tamu.edu?subject=%5BACAI-FEEDBACK%5D" target="_blank" rel="noreferrer">
                    <code>[ACAI-FEEDBACK]</code>
                </Link>{" "}
                for general site feedback.
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Citation */}
            <Typography variant="h5" gutterBottom>
                Citation
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
                Building on this work? Here&rsquo;s the BibTeX &mdash; let us know what you make!
            </Typography>

            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    backgroundColor: "#E5EEE3",
                    borderColor: "#C8C9BC",
                    overflowX: "auto",
                }}
            >
                <Box
                    component="pre"
                    sx={{
                        m: 0,
                        fontFamily: '"Roboto Mono", "Menlo", "Monaco", monospace',
                        fontSize: "0.8125rem",
                        lineHeight: 1.6,
                        whiteSpace: "pre",
                    }}
                >
                    {BIBTEX}
                </Box>
            </Paper>

            <Divider sx={{ my: 4 }} />

            {/* Affiliations */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
                    A collaboration between
                </Typography>
                <Box
                    component="img"
                    src="/affiliations.png"
                    alt="Texas A&M University, Cornell University, and the American Association for the Advancement of Science"
                    sx={{
                        maxWidth: "100%",
                        height: "auto",
                        maxHeight: 110,
                    }}
                />
            </Box>
        </Box>
    );
};

export default About;
