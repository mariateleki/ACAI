import { Button, Typography } from "@mui/material";
import LinkGroup from "./LinkGroup";
import institutions from "../../../data/institutions_final.json";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

interface InsDetailProps {
  selectedIns: string;
  setSelectedIns: (v: string | null) => void;
}

const InsDetail = ({ selectedIns, setSelectedIns }: InsDetailProps) => {
  const u = institutions.find(i => i.institution === selectedIns);
  if (!u) return null;

  return (
    <div style={{ width: "100%" }}>
      <Button variant="outlined" size="small" onClick={() => setSelectedIns(null)} style={{ marginBottom: 16 }}>
        <KeyboardArrowLeftIcon /> Back to List
      </Button>
      <Typography variant="h5" fontWeight="bold">{u.institution}</Typography>
      <Typography variant="body1">Type: {u.type}</Typography>
      <Typography variant="body1">Research Level: {u.researchActivity}</Typography>
      <Typography variant="body1">Size: ~{u.sizeStudentsInThousands}k Students</Typography>
      <Typography variant="body1" textTransform={"capitalize"}>Size Bucket: {u.sizeBucket}</Typography>
      <Typography variant="body1">Region: {u.regionalCoverage}</Typography>

      <LinkGroup title="University Rules/Policies/Regulations" links={u.t1UniversityRulesPoliciesRegulations} />
      <LinkGroup title="Center for Teaching & Learning" links={u.t2CenterForTeachingAndLearning} />
      <LinkGroup title="AI Institute/Initiative/Center/Hub/AI@U" links={u.t3AiInstituteInitiativeCenterHubAi} />
      <LinkGroup title="Library/Library Guides" links={u.t4LibraryLibraryGuides} />
      <LinkGroup title="Academic Integrity/Honor Code" links={u.t5AcademicIntegrityHonorCode} />
      <LinkGroup title="AI Steering Committee/Task Force" links={u.t6AiSteeringCommitteeTaskForce} />
      <LinkGroup title="Other Relevant Links" links={u.t7OtherRelevantLinks} />
    </div>
  );
};

export default InsDetail;
