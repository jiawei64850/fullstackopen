import { OccupationalHealthcareEntry } from "../types";
import WorkIcon from '@mui/icons-material/Work';

interface OccupationalHealthcareProps {
  entry: OccupationalHealthcareEntry;
  desc: string;
}

const OccupationalHealthcareEntryComponent: React.FC<OccupationalHealthcareProps> = ({ entry, desc }) => {
  return (
    <>
      <span><WorkIcon /> {entry.employerName}</span> <br />
      <em>{desc}</em>
      {entry.sickLeave && 
        <>
          <p>sickleave: </p>
          <ul>
            <li>start date: {entry.sickLeave?.startDate}</li>
            <li>end date: {entry.sickLeave?.endDate}</li>
          </ul>
        </>
      }
    </>
  );
};

export default OccupationalHealthcareEntryComponent;

