import diagnoses from "../data/diagnoses";

import { Diagnosis } from "../types";


const getEntries = () : Diagnosis[] => {
  return diagnoses;
};
  
const addDiagnose = () => {
  return null;
};


const getInfo = (code: string) : Diagnosis | undefined => {
  const diagnose = diagnoses.find(d => d.code === code)
  return diagnose;
};

export default {
  getEntries,
  addDiagnose,
  getInfo,
};