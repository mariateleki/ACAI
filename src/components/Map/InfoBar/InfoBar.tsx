import InsList from "./InsList";
import InsDetail from "./InsDetail";

interface InfoBarProps {
    selectedIns: string | null;
    setSelectedIns: (v: string | null) => void;
    selectedType: string;
    setSelectedType: (v: string) => void;
    selectedResearch: string;
    setSelectedResearch: (v: string) => void;
    sizeRange: number[];
    setSizeRange: (v: number[]) => void;
    selectedRegion: string;
    setSelectedRegion: (v: string) => void;
}

const InfoBar = ({
    selectedIns,
    setSelectedIns,
    selectedType,
    setSelectedType,
    selectedResearch,
    setSelectedResearch,
    sizeRange,
    setSizeRange,
    selectedRegion,
    setSelectedRegion,
}: InfoBarProps) => {
    return (
        <div
            style={{
                width: 330,
                flexShrink: 0,
                borderLeft: "1px solid #ccc",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div style={{ padding: "1rem" }}>
                {selectedIns ? (
                    <InsDetail selectedIns={selectedIns} setSelectedIns={setSelectedIns} />
                ) : (
                    <InsList
                        selectedType={selectedType}
                        setSelectedType={setSelectedType}
                        selectedRegion={selectedRegion}
                        setSelectedRegion={setSelectedRegion}
                        selectedResearch={selectedResearch}
                        setSelectedResearch={setSelectedResearch}
                        sizeRange={sizeRange}
                        setSizeRange={setSizeRange}
                        setSelectedIns={setSelectedIns}
                    />
                )}
            </div>

        </div>
    );
};

export default InfoBar;
