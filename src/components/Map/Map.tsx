import { useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
    Annotation,
} from "react-simple-maps";
import allStates from "../../data/allStates.json";
import eastStates from "../../data/eastStates.json";
import institutions from "../../data/institutions_final.json";
import InfoBar from "./InfoBar/InfoBar";
import { COLORS } from "../../theme/colors"; 
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const Map = () => {
    const [selectedIns, setSelectedIns] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string>("All");
    const [selectedResearch, setSelectedResearch] = useState<string>("All");
    const [selectedRegion, setSelectedRegion] = useState<string>("All");
    const [sizeRange, setSizeRange] = useState<number[]>([1, 80]);
    const [center, setCenter] = useState<[number, number]>([-97, 37]);
    const [zoom, setZoom] = useState<number>(1);

    const filteredInstitutions = institutions.filter((u) => {
        const typeMatch = selectedType === "All" || u.type === selectedType;
        const researchMatch =
            selectedResearch === "All" || u.researchActivity === selectedResearch;
        const regionMatch = selectedRegion === "All" || u.regionalCoverage === selectedRegion;
        const sizeMatch = u.sizeStudentsInThousands >= sizeRange[0] && u.sizeStudentsInThousands <= sizeRange[1];
        return typeMatch && researchMatch && regionMatch && sizeMatch;
    });

    const displayedInstitutions = selectedIns
        ? filteredInstitutions.filter((u) => u.institution === selectedIns)
        : filteredInstitutions;

    return (
        <div style={{ display: "flex", width: "100vw", height: "100%", overflow: "hidden" }}>
            <div style={{ flex: 1, height: "100%" }}>
                <ComposableMap
                    projection="geoAlbersUsa"
                    onClick={() => setSelectedIns(null)}
                    style={{ width: "100%", height: "100%", display: "block" }}
                    preserveAspectRatio="xMidYMid meet"
                >
                    <ZoomableGroup
                        zoom={zoom}
                        minZoom={1}
                        maxZoom={5}
                        center={center}
                        onMoveEnd={(position: { coordinates: [number, number]; zoom: number }) => {
                            setZoom(position.zoom);
                            setCenter(position.coordinates);
                        }}
                    >
                        <Geographies
                            geography={geoUrl}
                            style={{
                                default: { outline: "none" },
                                hover: { outline: "none" },
                                pressed: { outline: "none" },
                            }}
                        >
                            {({ outline, borders }: { outline: any; borders: any }) => (
                                <>
                                    <Geography geography={outline} fill={COLORS.mapBackground} />
                                    <Geography geography={borders} fill="none" stroke={COLORS.mapStroke} strokeWidth={0.7}  />
                                </>
                            )}
                        </Geographies>

                        {allStates
                            .filter((s) => s.isEastStates === 0)
                            .map((s) => (
                                <Annotation
                                    key={s.id}
                                    subject={s.subject}
                                    dx={s.dx}
                                    dy={s.dy}
                                    connectorProps={{ stroke: "none" }}
                                >
                                    <text
                                        x={0}
                                        y={0}
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        style={{ fontSize: 12, fill: COLORS.primary }}
                                    >
                                        {s.id}
                                    </text>
                                </Annotation>
                            ))}

                        {eastStates.map((s) => (
                            <Annotation
                                key={s.id}
                                subject={s.subject}
                                dx={s.dx}
                                dy={s.dy}
                                connectorProps={{
                                    stroke: "#555555",
                                    strokeWidth: 1,
                                    strokeLinecap: "round",
                                }}
                            >
                                <text
                                    x={0}
                                    y={0}
                                    textAnchor="start"
                                    alignmentBaseline="middle"
                                    style={{ fontSize: 12, fill: COLORS.primary }}
                                >
                                    {s.id}
                                </text>
                            </Annotation>
                        ))}

                        {displayedInstitutions.map((u) => (
                            <Marker
                                key={u.institution}
                                coordinates={[u.lng + (u.dx ?? 0), u.lat + (u.dy ?? 0)]}
                                onClick={(e: React.MouseEvent<SVGElement, MouseEvent>) => {
                                    e.stopPropagation();
                                    setSelectedIns(u.institution);
                                }}
                            >
                                <circle
                                    r={5 / Math.pow(zoom, 0.5)}
                                    fill={COLORS.mapMarkerFill}
                                    stroke={COLORS.mapMarkerStroke}
                                    strokeWidth={1 / Math.pow(zoom, 0.5)}
                                    style={{ cursor: "pointer" }}
                                />
                            </Marker>
                        ))}
                    </ZoomableGroup>
                </ComposableMap>
            </div>
            <InfoBar
                selectedIns={selectedIns}
                setSelectedIns={setSelectedIns}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedResearch={selectedResearch}
                setSelectedResearch={setSelectedResearch}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                sizeRange={sizeRange}
                setSizeRange={setSizeRange}
            />
        </div>
    );
};

export default Map;
