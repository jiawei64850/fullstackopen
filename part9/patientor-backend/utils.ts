
import { 
  NewPatientEntry, Gender, Entry
  } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};


const isName = (name: string): boolean => {
  return isString(name) && name.trim().length > 0;
};

const parseName = (name: unknown): string => {
  if (!isString(name) || !isName(name)) {
      throw new Error('Incorrect or missing name: ' + name);
  }
  return name;
};

const isDateOfBirth = (dateOfBirth: string): boolean => {
  return Boolean(Date.parse(dateOfBirth));
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth) || !isDateOfBirth(dateOfBirth)) {
      throw new Error('Incorrect or missing date of birth: ' + dateOfBirth);
  }
  return dateOfBirth;
};

const isSsn = (ssn: string): boolean => {
  return isString(ssn) && ssn.trim().length > 0;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn) || !isSsn(ssn)) {
      throw new Error('Incorrect or missing ssn: ' + ssn);
  }
  return ssn;
};


const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
      throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const isOccupation = (occupation: string): boolean => {
  return isString(occupation) && occupation.trim().length > 0;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation) || !isOccupation(occupation)) {
      throw new Error('Incorrect or missing occupation: ' + occupation);
  }
  return occupation;
};

const isEntries = (entries: unknown): entries is Entry[] => {
  return Array.isArray(entries) && entries.every(entry => typeof entry === 'object');
};

const parseEntries = (entries: unknown): Entry[] => {
  if (!isEntries(entries)) {
    throw new Error('Incorrect or missing entries: ' + entries);
  }
  return entries;
};

const toNewPatientEntry = (object: unknown) : NewPatientEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }
  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object 
    && 'gender' in object && 'occupation' in object && 'entries' in object)  {
    const newEntry: NewPatientEntry = {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: parseEntries(object.entries)
    };
    return newEntry;
  }
  throw new Error('Incorrect data: some fields are missing');
};


export default toNewPatientEntry;