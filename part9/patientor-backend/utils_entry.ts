
import { 
    HealthCheckRating, Diagnosis, EntryWithoutId, BaseEntry
  } from "./types";
  
  const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
  };
  
  const isNumber = (text: unknown): text is number => {
    return typeof text === 'number' || text instanceof Number;
  };
  
  
  const isDescription = (description: string): boolean => {
    return isString(description) && description.trim().length > 0;
  };
  
  const parseDescription = (description: unknown): string => {
    if (!isString(description) || !isDescription(description)) {
        throw new Error('Incorrect or missing description: ' + description);
    }
    return description;
  };
  
  const isDate = (date: string): boolean => {
    return isString(date) && date.trim().length > 0;
  };
  
  const parseDate = (date: unknown): string => {
    if (!isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return date;
  };
  
  const isSpecialist = (specialist: string): boolean => {
    return isString(specialist) && specialist.trim().length > 0;
  };
  
  const parseSpecialist = (specialist: unknown): string => {
    if (!isString(specialist) || !isSpecialist(specialist)) {
        throw new Error('Incorrect or missing specialist: ' + specialist);
    }
    return specialist;
  };
  
  const isEmployerName = (employerName: string): boolean => {
    return isString(employerName) && employerName.trim().length > 0;
  };
  
  const parseEmployerName = (employerName: unknown): string => {
    if (!isString(employerName) || !isEmployerName(employerName)) {
        throw new Error('Incorrect or missing occupation: ' + employerName);
    }
    return employerName;
  };
  
  const isSickLeave  = (startDate : string, endDate : string): boolean => {
    return isString(startDate) && isString(endDate) 
      && startDate.trim().length > 0 && endDate.trim().length > 0;
  };
  
  interface SickLeave {
    startDate: string;
    endDate: string;
  }
  
  const parseSickLeave = (sickLeave: unknown): SickLeave => {
    if (!sickLeave || typeof sickLeave !== 'object') {
      throw new Error('Missing or incorrect sick leave');
    }
  
    if ('startDate' in sickLeave && 'endDate' in sickLeave) {
      if (isString(sickLeave.startDate) && isString(sickLeave.endDate) && isSickLeave(sickLeave.startDate, sickLeave.endDate)) {
        return { startDate: sickLeave.startDate, endDate: sickLeave.endDate };
      }
    }
  
    throw new Error('Incorrect or missing sick leave: ' + JSON.stringify(sickLeave));
  };
  
  interface Discharge {
    date: string;
    criteria: string;
  }
  
  const isDischarge  = (date : string, criteria : string): boolean => {
    return isString(date) && isString(criteria) 
      && date.trim().length > 0 && criteria.trim().length > 0;
  };
  
  const parseDischarge = (discharge: unknown): Discharge => {
    if (!discharge || typeof discharge !== 'object') {
      throw new Error('Missing or incorrect discharge');
    }
  
    if ('date' in discharge && 'criteria' in discharge) {
      if (isString(discharge.date) && isString(discharge.criteria) && isDischarge(discharge.date, discharge.criteria)) {
        return { date: discharge.date, criteria: discharge.criteria };
      }
    }
  
    throw new Error('Incorrect or missing discharge: ' + JSON.stringify(discharge));
  };
  
  
  const isHealthCheckRating = (param: number): param is HealthCheckRating => {
    return Object.values(HealthCheckRating).map(v => v).includes(param);
  };
  
  const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
    if (!isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
        throw new Error('Incorrect or missing healthCheck rating: ' + healthCheckRating);
    }
    return healthCheckRating;
  };


  const isDiagnosisCodes = (diagnosisCodes: unknown): diagnosisCodes is Array<Diagnosis['code']> => {
    return Array.isArray(diagnosisCodes) && diagnosisCodes.every(code => isString(code));
  };
  
  const parseDiagnosisCodes = (diagnosisCodes: unknown): Array<Diagnosis['code']> => {
    if (!diagnosisCodes || !isDiagnosisCodes(diagnosisCodes)) {
      throw new Error('Incorrect or missing diagnosis codes');
    }
    return diagnosisCodes;
  };
  
  
const toNewEntry = (object: unknown) : EntryWithoutId => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }
  if ('description' in object && 'date' in object && 'specialist' in object) {
    let newBaseEntry: Omit<BaseEntry, 'id'> = {
      description: parseDescription(object.description),
      date: parseDate(object.date),
      specialist: parseSpecialist(object.specialist),
  };
  if ('diagnosisCodes' in object) {
    newBaseEntry = {
      ...newBaseEntry,
      diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes)
    }
  }
  if ('type' in object) {
    switch (object.type) {
      case 'Hospital': 
        if ('discharge' in object) {
          const newEntry: EntryWithoutId = { ...newBaseEntry, type: 'Hospital', discharge: parseDischarge(object.discharge) }
        return newEntry;
        }
      throw new Error('Missing discharge data for Hospital entry');
      case 'OccupationalHealthcare':
        if ('employerName' in object) {
          let newEntry: EntryWithoutId = { ...newBaseEntry, type: 'OccupationalHealthcare', employerName: parseEmployerName(object.employerName) }
          if ('sickLeave' in object) {
            newEntry = { ...newEntry, sickLeave: parseSickLeave(object.sickLeave)}
          }
        return newEntry; 
        }
      throw new Error('Missing employerName for OccupationalHealthcare entry');
      case 'HealthCheck':
        if ('healthCheckRating' in object) {
          const newEntry: EntryWithoutId = { ...newBaseEntry, type: 'HealthCheck', healthCheckRating: parseHealthCheckRating(object.healthCheckRating)}
        return newEntry;
        }
      throw new Error('Missing healthCheckRating for HealthCheck entry');
      default: 
        throw new Error('Invalid or missing entry type');
      }
    } else {
      throw new Error('Missing or incorrect type');
    }
  } else {
    throw new Error('Incorrect data: some fields are missing');
  }
};

export default toNewEntry;