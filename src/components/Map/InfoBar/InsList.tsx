import {
    Box, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Button, 
    Slider, 
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Link,
} from "@mui/material";

import institutions from "../../../data/institutions_final.json";
import { COLORS } from "../../../theme/colors";

interface InsListProps {
    selectedType: string;
    selectedResearch: string;
    sizeRange: number[];
    selectedRegion: string;
    setSizeRange: (v: number[]) => void;
    setSelectedIns: (v: string) => void;
    setSelectedType: (v: string) => void;
    setSelectedRegion: (v: string) => void;
    setSelectedResearch: (v: string) => void;
}

const InsList = ({
    selectedType,
    selectedResearch,
    sizeRange,
    selectedRegion,
    setSelectedIns,
    setSelectedType,
    setSelectedRegion,
    setSelectedResearch,
    setSizeRange
}: InsListProps) => {
    const handleSizeChange = (_event: Event, newValue: number | number[]) => {
        setSizeRange(newValue as number[]);
    };
    const valuetext = (value: number) => `${value}`;
    const filteredInstitutions = institutions.filter(u =>
        (selectedType === "All" || u.type === selectedType) &&
        (selectedResearch === "All" || u.researchActivity === selectedResearch) &&
        (selectedRegion === "All" || u.regionalCoverage === selectedRegion) &&
        u.sizeStudentsInThousands >= sizeRange[0] && u.sizeStudentsInThousands <= sizeRange[1]
    );

    return (
        <div style={{ width: "100%", overflowY: "auto" }}>
            {/* Filter */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <h3 style={{ margin: 0 }}>Filter by:</h3>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                        setSelectedType("All");
                        setSelectedResearch("All");
                        setSelectedRegion("All");
                        setSizeRange([1, 80]);
                    }}
                >
                    Clear Filter
                </Button>
            </Box>

            <Box display="flex" gap={2} mb={2}>
                <FormControl fullWidth size="small">
                    <InputLabel>Research Level</InputLabel>
                    <Select value={selectedResearch} label="Research Level" onChange={(e) => setSelectedResearch(e.target.value)}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="R1">R1</MenuItem>
                        <MenuItem value="R2">R2</MenuItem>
                        <MenuItem value="-">-</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                    <InputLabel>Region</InputLabel>
                    <Select value={selectedRegion} label="Region" onChange={(e) => setSelectedRegion(e.target.value)}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="West">West</MenuItem>
                        <MenuItem value="South">South</MenuItem>
                        <MenuItem value="Midwest">Midwest</MenuItem>
                        <MenuItem value="Northeast">Northeast</MenuItem>

                    </Select>
                </FormControl>
            </Box>

            <Box display="flex" gap={2} mb={2}>
                <FormControl fullWidth size="small">
                    <InputLabel>Type</InputLabel>
                    <Select value={selectedType} label="Type" onChange={(e) => setSelectedType(e.target.value)}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Public Research-Oriented">Public Research-Oriented</MenuItem>
                        <MenuItem value="Private Research-Oriented">Private Research-Oriented</MenuItem>
                        <MenuItem value="Teaching-Oriented/Liberal Arts">Teaching-Oriented/Liberal Arts</MenuItem>
                    </Select>
                </FormControl>
                {/* <FormControl fullWidth></FormControl> */}
            </Box>

            {/* Slider */}
            <Box sx={{ width: "98%" }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Size:</Typography>
                    <Typography variant="body2">~{sizeRange[0]} - {sizeRange[1]}k Students</Typography>
                </Box>
                <Box sx={{ mx: 3 }}>
                    <Slider
                        getAriaLabel={() => 'Size Range'}
                        value={sizeRange}
                        onChange={handleSizeChange}
                        valueLabelDisplay="auto"
                        min={1}
                        max={80}
                        getAriaValueText={valuetext}
                        sx={{
                            color: COLORS.mapMarkerFill,
                            "& .MuiSlider-thumb": {
                                border: `2px solid ${COLORS.mapMarkerFill}`,
                            },
                            "& .MuiSlider-valueLabel": {
                                backgroundColor: COLORS.mapMarkerFill,
                            },
                        }}
                    />
                </Box>
            </Box>

            {/* Institutions Table */}
            <TableContainer component={Paper} sx={{ marginTop: 2, width: "100%" }}>
                <Table size="small" sx={{ tableLayout: "fixed" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="left"
                                sx={{ width: 35, py: 0.5, px: 0 }}
                            >
                                Rank
                            </TableCell>
                            <TableCell align="left" sx={{ width: 160, py: 0.5, px: 1 }}>
                                Institution
                            </TableCell>
                            <TableCell align="left" sx={{ width: 50, py: 0.5, px: 0 }}>
                                ACAI Indicators
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInstitutions
                            .sort((a, b) => a.rank - b.rank)
                            .map((school) => (
                                <TableRow key={school.institution} hover>
                                    <TableCell
                                        align="left"
                                        sx={{ width: 35, py: 0.5, px: 1 }}
                                    >
                                        {school.rank}
                                    </TableCell>
                                    <TableCell align="left" sx={{ width: 160, py: 0.5, px: 1 }}>
                                        <Link
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedIns(school.institution);
                                            }}
                                            underline="hover"
                                        >
                                            {school.institution}
                                        </Link>
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        sx={{ width: 50, py: 0.5, px: 1 }}
                                    >
                                        {school.acaiIndicators}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default InsList;
