import { HealthCheckRating, HealthCheckEntry } from "../types";
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { red } from "@mui/material/colors";


interface HealthCheckEntryProps {
  entry: HealthCheckEntry; 
  desc: string; 
}

const HealthCheckEntryComponent: React.FC<HealthCheckEntryProps> = ({ entry, desc }) => {
  const setCheckHeart = (rating: HealthCheckRating) => {
    switch (rating) {
    case HealthCheckRating.Healthy :
      return <FavoriteIcon sx={ { color: red[100] } } />;
    case HealthCheckRating.LowRisk :
      return <FavoriteIcon sx={ { color: red[300] } } />;
    case HealthCheckRating.HighRisk :
      return <FavoriteIcon sx={ { color: red[500] } } />;
    case HealthCheckRating.CriticalRisk :
      return <FavoriteIcon sx={ { color: red[700] } } />;
    }
  };
  
  return (
    <>
      <MedicalServicesIcon /> <br />
      <em>{desc}</em> <br />
      {setCheckHeart(entry.healthCheckRating)}
    </>
  );
};

export default HealthCheckEntryComponent;