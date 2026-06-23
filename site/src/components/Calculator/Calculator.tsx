import { useMemo, useState } from "react";
import {
    Box,
    Typography,
    Divider,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Stack,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { ACAI_US79_SCORES, ACAI_US79_N } from "../../data/acaiUS79Scores";

type Score = 0 | 0.5 | 1;
type DomainKey = "A" | "B" | "C" | "D";

type Indicator = { id: string; domain: DomainKey; text: string };

const INDICATORS: Indicator[] = [
    { id: "A1", domain: "A", text: "The university defines “AI use,” “AI assistance,” or “AI-generated content.”" },
    { id: "A2", domain: "A", text: "The university defines standards for citing AI-generated material." },
    { id: "B1", domain: "B", text: "The university provides guidance, training, or resources for faculty on AI-related teaching practices." },
    { id: "B2", domain: "B", text: "Official examples of appropriate and/or prohibited AI use are provided (e.g. example AI use cases, example prompts)." },
    { id: "B3", domain: "B", text: "A faculty committee or group focused on teaching and learning about AI exists." },
    { id: "B4", domain: "B", text: "Faculty are offered syllabus language examples (e.g. use AI/don’t use AI/selectively use AI)." },
    { id: "C1", domain: "C", text: "A faculty committee or advisory group focused on university AI policy or governance exists." },
    { id: "C2", domain: "C", text: "A student committee or advisory group focused on university AI policy or governance exists." },
    { id: "C3", domain: "C", text: "The university publishes AI policy update logs or explains revisions." },
    { id: "D1", domain: "D", text: "The university restricts, discourages, or warns against the use of AI detection tools." },
    { id: "D2", domain: "D", text: "Student misconduct determinations require human review and cannot be based solely on AI detection tools." },
];

const DOMAINS: { key: DomainKey; title: string; color: string; blurb: string }[] = [
    {
        key: "A",
        title: "A. Policy Clarity",
        color: "#4C72B0",
        blurb: "Can affected parties identify the rules?",
    },
    {
        key: "B",
        title: "B. Faculty Support",
        color: "#55A868",
        blurb: "Do faculty have the institutional support to apply them consistently?",
    },
    {
        key: "C",
        title: "C. Feedback Mechanisms",
        color: "#C44E52",
        blurb: "Are there structured mechanisms for participation and revision?",
    },
    {
        key: "D",
        title: "D. Detection Tools",
        color: "#8172B2",
        blurb: "Are the uses of AI detection technology — among the highest-stakes procedural interventions universities deploy — governed by safeguards against error and abuse?",
    },
];

const WEIGHTING_SCHEMES: Record<string, Record<DomainKey, number>> = {
    equal:          { A: 1, B: 1, C: 1, D: 1 },
    indicators:     { A: 2, B: 4, C: 3, D: 2 },
    policy_heavy:   { A: 1, B: 1, C: 2, D: 2 },
    teaching_heavy: { A: 1, B: 2, C: 1, D: 1 },
};

const SCHEME_LABELS: Record<string, string> = {
    equal: "Equal (1 / 1 / 1 / 1)",
    indicators: "Indicator-weighted (2 / 4 / 3 / 2)",
    policy_heavy: "Policy-heavy (1 / 1 / 2 / 2)",
    teaching_heavy: "Teaching-heavy (1 / 2 / 1 / 1)",
};

const defaultScores = (): Record<string, Score> =>
    Object.fromEntries(INDICATORS.map((i) => [i.id, 0 as Score]));

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

export default function Calculator() {
    const [scores, setScores] = useState<Record<string, Score>>(defaultScores);
    const [scheme, setScheme] = useState<keyof typeof WEIGHTING_SCHEMES>("indicators");

    const { acai, rank, percentile } = useMemo(() => {
        const means = { A: 0, B: 0, C: 0, D: 0 } as Record<DomainKey, number>;
        for (const d of ["A", "B", "C", "D"] as DomainKey[]) {
            const inDomain = INDICATORS.filter((i) => i.domain === d);
            means[d] = inDomain.reduce((s, i) => s + scores[i.id], 0) / inDomain.length;
        }
        const w = WEIGHTING_SCHEMES[scheme];
        const totalW = w.A + w.B + w.C + w.D;
        const acaiScore =
            ((w.A * means.A + w.B * means.B + w.C * means.C + w.D * means.D) /
                totalW) *
            100;

        // Place the user's score within the ACAI-US79 distribution under the
        // currently selected weighting scheme. Reference scores are stored at
        // 2-decimal precision (matching process_acai_index.py's .round(2)),
        // so round the user's score to the same precision before comparing —
        // otherwise repeating-decimal user scores (e.g. 27.2727…) are read
        // as strictly above a tied reference (27.27) and inflate the rank.
        const ref = ACAI_US79_SCORES[scheme];
        const acaiRounded = Math.round(acaiScore * 100) / 100;
        const better = ref.filter((s) => s < acaiRounded).length;
        const equal = ref.filter((s) => s === acaiRounded).length;
        // Percentile rank: fraction strictly worse + half of ties (mid-rank).
        const pct = ((better + 0.5 * equal) / ref.length) * 100;
        // Position the user within the 79-school ranking; clamp at the
        // bottom so the rank never exceeds the dataset size when the user's
        // score is below every audited institution.
        const rk = Math.min(ref.length, ref.filter((s) => s > acaiRounded).length + 1);
        return {
            acai: acaiScore,
            domainMeans: means,
            rank: rk,
            percentile: pct,
        };
    }, [scores, scheme]);

    const setIndicator = (id: string, value: Score | null) => {
        if (value === null) return;
        setScores((prev) => ({ ...prev, [id]: value }));
    };

    return (
        <Box
            sx={{
                px: 4,
                py: 4,
                overflow: "auto",
                maxWidth: 900,
                mx: "auto",
                width: "100%",
            }}
        >
            <Typography variant="h4" gutterBottom>
                Want to score <em>your</em> university?
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
                Use the calculator below to see how your institution stacks up against the
                79 universities we audited in ACAI-US79.
            </Typography>

            <Box component="ol" sx={{ pl: 3, mb: 3, "& li": { mb: 0.5 } }}>
                <Typography component="li" variant="body1">
                    <strong>Browse</strong> your university&rsquo;s public-facing AI-related web pages.
                </Typography>
                <Typography component="li" variant="body1">
                    <strong>Tag</strong> each of the 11 ACAI indicators as{" "}
                    <Box component="span" sx={pillSx("#FDECEA", "#B71C1C")}>❌ Absent</Box> (0.0),{" "}
                    <Box component="span" sx={pillSx("#FFF8E1", "#8D6708")}>➖ Partial</Box> (0.5),
                    or <Box component="span" sx={pillSx("#E8F5E9", "#2E7D32")}>✅ Present</Box> (1.0).
                </Typography>
                <Typography component="li" variant="body1">
                    <strong>Watch</strong> your ACAI score, percentile, and rank update live above.
                </Typography>
            </Box>

            {/* Result + scheme selector */}
            <Paper
                variant="outlined"
                sx={{
                    px: 3,
                    py: 1,
                    mb: 4,
                    position: "sticky",
                    top: 8,
                    zIndex: 1,
                    backgroundColor: "#EEEEEE",
                }}
            >
                <Stack spacing={1} alignItems="center" textAlign="center">
                    <Typography variant="body1" color="text.secondary">
                        Your ACAI Score is&hellip;
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 600, lineHeight: 1 }}>
                        {acai.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        which falls at Rank <strong>{rank}</strong> of {ACAI_US79_N}.
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        This rank is better than <strong>{percentile.toFixed(0)} percent</strong> of universities in the ACAI-US79 dataset.
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 260, mt: 1 }}>
                        <InputLabel id="scheme-label">Weighting scheme</InputLabel>
                        <Select
                            labelId="scheme-label"
                            label="Weighting scheme"
                            value={scheme}
                            onChange={(e: SelectChangeEvent<string>) =>
                                setScheme(e.target.value as keyof typeof WEIGHTING_SCHEMES)
                            }
                        >
                            {Object.keys(WEIGHTING_SCHEMES).map((s) => (
                                <MenuItem key={s} value={s}>
                                    {SCHEME_LABELS[s]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>

                <Box sx={{ mt: 0.5, textAlign: "right" }}>
                    <Button size="small" onClick={() => setScores(defaultScores())}>
                        Reset all
                    </Button>
                </Box>
            </Paper>

            {/* Indicators by domain */}
            {DOMAINS.map((d) => (
                <Box key={d.key} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: d.color }}>
                        {d.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: d.color, opacity: 0.85, mb: 1, fontStyle: "italic" }}
                    >
                        {d.blurb}
                    </Typography>
                    <Divider sx={{ mb: 2, borderColor: d.color, opacity: 0.4 }} />
                    <Stack spacing={2}>
                        {INDICATORS.filter((i) => i.domain === d.key).map((i) => (
                            <Box
                                key={i.id}
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    alignItems: { xs: "flex-start", sm: "center" },
                                    gap: 2,
                                }}
                            >
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2">
                                        <strong>{i.id}.</strong> {i.text}
                                    </Typography>
                                </Box>
                                <ToggleButtonGroup
                                    exclusive
                                    size="small"
                                    value={scores[i.id]}
                                    onChange={(_, v) => setIndicator(i.id, v as Score | null)}
                                    sx={{ flexShrink: 0 }}
                                >
                                    <ToggleButton
                                        value={0}
                                        sx={{
                                            "&.Mui-selected": {
                                                backgroundColor: "#FDECEA",
                                                color: "#B71C1C",
                                                "&:hover": { backgroundColor: "#F9C9C5" },
                                            },
                                        }}
                                    >
                                        ❌ Absent
                                    </ToggleButton>
                                    <ToggleButton
                                        value={0.5}
                                        sx={{
                                            "&.Mui-selected": {
                                                backgroundColor: "#FFF8E1",
                                                color: "#8D6708",
                                                "&:hover": { backgroundColor: "#FFECB3" },
                                            },
                                        }}
                                    >
                                        ➖ Partial
                                    </ToggleButton>
                                    <ToggleButton
                                        value={1}
                                        sx={{
                                            "&.Mui-selected": {
                                                backgroundColor: "#E8F5E9",
                                                color: "#2E7D32",
                                                "&:hover": { backgroundColor: "#C8E6C9" },
                                            },
                                        }}
                                    >
                                        ✅ Present
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            ))}
        </Box>
    );
}
