import patients from "../data/patients";
import { NonSensitivePatient, Patient, NewPatientEntry, Entry, EntryWithoutId } from "../types";
import { v1 as uuid } from 'uuid';

const getEntries = () : Patient[] => {
  return patients;
};


const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name, 
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = ( entry : NewPatientEntry ) : Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const findById = (id: string): Patient | undefined => {
  const entry = patients.find(p => p.id === id);
  return entry;
};

const addPatientEntry = (patientId: string, entry: EntryWithoutId) : Entry => {
  const patient = patients.find(p => p.id === patientId)
  if (!patient) {
    throw new Error(`Patient with id ${patientId} not found`);
  }

  const newEntry = {
    id: uuid(),
    ...entry
  };

  patient.entries = patient.entries.concat(newEntry);
  return newEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  findById,
  addPatientEntry
};