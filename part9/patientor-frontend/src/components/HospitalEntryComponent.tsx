import { HospitalEntry } from "../types";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

interface HospitalEntryProps {
  entry: HospitalEntry;
  desc: string;
}

const HospitalEntryComponent: React.FC<HospitalEntryProps> = ({ entry, desc }) => {
  return (
    <>
      <LocalHospitalIcon /> <br />
      <em>{desc}</em>
      <p>discharge: </p>
      <ul> 
        <li>date: {entry.discharge.date}</li>
        <li>criteria: {entry.discharge.criteria}</li>
      </ul>
    </>
  );
};

export default HospitalEntryComponent;