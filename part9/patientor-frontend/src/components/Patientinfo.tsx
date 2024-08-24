import { Container, Box, Stack, Button, TextField, Alert, SelectChangeEvent, InputLabel, MenuItem, Select, Typography, Rating, FormHelperText } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Entry, EntryWithoutId, Patient, Diagnosis } from "../types";
import axios from 'axios';
import patientService from "../services/patients";
import diagnosesService from '../services/diagnoses';
import React, { useEffect, useState, SyntheticEvent  } from "react";
import { useParams } from "react-router-dom";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import HealthCheckEntryComponent from './HealthCheckEntryComponent';
import HospitalEntryComponent from './HospitalEntryComponent';
import OccupationalHealthcareEntryComponent from './OccupationalHealthcareEntryComponent';

interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}


interface Props {
  patient: Patient | undefined;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
}

interface EntryProps {
  entry: Entry;
  desc: string;
}

interface EntryOption {
  value: string;
  label: string;
}

const entryOptions: EntryOption[] = [
  { value: "Hospital", label: "Hospital" },
  { value: "OccupationalHealthcare", label: "Occupational Healthcare" },
  { value: "HealthCheck", label: "Health Check" }
];



const PatientInfo = ({ patient, setPatient } : Props) => {
  const [diagnoseNames, setDiagnoseNames] = useState<{ [code: string]: string }>({});
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [healthCheckRating, setHealthCheckRating] = useState<string>('');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [notify, setNotify] = useState<string>('');
  const [entry, setEntry] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [employerName, setEmployerName] = useState<string>('');
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [dischargeCriteria, setDischargeCriteria] = useState<string>('');

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const fetchPatient = await patientService.getSomeOne(id);
        setPatient(fetchPatient);
      }
    };
    void fetchPatient();
    const fetchDiagnose = async () => {
      const diagnoses = await diagnosesService.getAll();
      setDiagnoses(diagnoses);
    };
    void fetchDiagnose();
  }, [id, setPatient, setDiagnoses]);

  const onEntryChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setEntry(value);
  };

  const onDiagnoseCodesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setDiagnosisCodes(value);
  };

  const fetchDiagnosename = async (code: string) => {
    if (!diagnoseNames[code]) {
      const fetchedDiagnose = await diagnosesService.getInfo(code);
      setDiagnoseNames((prev) => ({ ...prev, [code]: fetchedDiagnose.name }));
    }
  };

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const EntryDetails: React.FC<EntryProps> = ({ entry, desc }) => {
    switch (entry.type) {
      case "Hospital":
        return <HospitalEntryComponent entry={entry} desc={desc}/>;
      case "OccupationalHealthcare":
        return <OccupationalHealthcareEntryComponent entry={entry} desc={desc} />;
      case "HealthCheck":
        return <HealthCheckEntryComponent entry={entry} desc={desc}/>;
      default:
        return assertNever(entry);
      }
  };

  const emptyState = () => {
    setDescription('');
    setDate('');
    setSpecialist('');
    setHealthCheckRating('');
    setDiagnosisCodes([]);
    setEntry('');
    setDischargeDate('');
    setDischargeCriteria('');
    setStartDate('');
    setEndDate('');
    setEmployerName('');
  };

  const addEntry = async (id: string) => { 
    let newEntry: EntryWithoutId;

    switch (entry) {
      case "Hospital":
        newEntry = {
          description,
          date,
          specialist,
          diagnosisCodes,
          type: "Hospital" as const,
          discharge: {
            date: dischargeDate, 
            criteria: dischargeCriteria 
          }
        };
        break;
      case "OccupationalHealthcare":
        newEntry = {
          description,
          date,
          specialist,
          diagnosisCodes,
          type: "OccupationalHealthcare" as const,
          employerName: String(employerName),
          sickLeave: startDate && endDate ? { startDate, endDate } : undefined
        };
        break;
      case "HealthCheck":
        newEntry = {
          description,
          date,
          specialist,
          diagnosisCodes,
          type: "HealthCheck" as const,
          healthCheckRating: Number(healthCheckRating)
        };
        break;
      default:
        setNotify("Invalid entry type");
        return;
    }
    
    try {
      const addedEntry = await patientService.addEntry(id, newEntry);
      
      setPatient((prevPatient) => 
        prevPatient 
          ? { ...prevPatient, entries: [...prevPatient.entries, addedEntry] } 
          : prevPatient
      );
  
      setIsVisible(true);
      emptyState();

    } catch (error: unknown) {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        const data = String(error.response?.data);
        const dataWithProcess = data.replace('Something went wrong.', '');
        setNotify(dataWithProcess);
        setTimeout(() => setNotify(''), 5000);
      } else {
        const data = String(error);
        const dataWithProcess = data.replace('Something went wrong.', '');
        setNotify(dataWithProcess);
        setTimeout(() => setNotify(''), 5000);
      }
    }
  };

  return (
    <div className="App">
      <Container maxWidth="sm">
        {(patient !== undefined) ? (
        <>
          <h3>{patient.name}
            {(patient.gender === 'male') && <MaleIcon /> }
            {(patient.gender === 'female') && <FemaleIcon /> }
            {(patient.gender === 'other') && <QuestionMarkIcon /> }
          </h3>
          <p>ssh: {patient.ssn} <br />
            occupation: {patient.occupation}
          </p>
          <Stack spacing={2}>
          {!isVisible &&
          <Box sx={{ p: '3px', border: '1px dashed grey', margin: '10px'}} component='form' noValidate autoComplete="off" >
            <h3>New entry</h3>
            <InputLabel>Entry Options</InputLabel>
              <Select
              label="Gender"
              fullWidth
              variant='standard'
              value={entry}
              onChange={onEntryChange}
              required
            >
            {entryOptions.map(option =>
            <MenuItem
                key={option.label}
                value={option.value}
            >
                {option.label
            }</MenuItem>
            )}
            </Select>
            <div>
              <TextField 
                label='Description' 
                variant='standard' 
                fullWidth 
                value={description}
                onChange={({ target }) => setDescription(target.value)}
              /> <br />
              <TextField 
                sx={{ marginTop: '1rem' }}
                label='Date' 
                type='date'
                variant='standard' 
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                value={date}
                onChange={({ target }) => setDate(target.value)}
              /> <br />
              <TextField 
                label='Specialist' 
                variant='standard' 
                fullWidth
                value={specialist}
                onChange={({ target }) => setSpecialist(target.value)}
              /> <br />
              <InputLabel sx={{ marginTop: '1rem'}}>Diagnosis Codes</InputLabel>
                <Select
                  multiple
                  value={diagnosisCodes}
                  onChange={onDiagnoseCodesChange}
                  renderValue={(selected) => selected.join(', ')}
                  size='small'
                  fullWidth
                >
                  {diagnoses.map((diagnosis) => (
                    <MenuItem key={diagnosis.code} value={diagnosis.code}>
                      {diagnosis.name} ({diagnosis.code})
                    </MenuItem>
                  ))}
                </Select>
              <TextField 
                label='Selected Diagnosis codes' 
                variant='standard' 
                fullWidth
                value={diagnosisCodes}
                disabled
              /> <br />
            </div>
            { entry === 'HealthCheck' &&
            <div>
              <InputLabel sx={{ marginTop: '1rem' }}>HealthCheck Rating</InputLabel>
              <Rating
                name="Healthcheck rating"
                value={Number(healthCheckRating)} 
                precision={1}
                icon={<FavoriteIcon fontSize="inherit" color='error'/>}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                max={3}
                onChange={(event: React.SyntheticEvent<Element, Event>, newValue: number | null) => {
                  event.preventDefault();
                  if (newValue !== null) {
                    setHealthCheckRating(newValue.toString());
                  }
                }
              }  
              />
              <FormHelperText>empty means 0 (Healthy), and 1 heart means Low Risky, and, as follow, 2 and 3 hearts mean High and Critical Risky.</FormHelperText>
              <br />
            </div>
            }
            { entry === 'OccupationalHealthcare' &&
            <div>
              <TextField 
                label='EmployerName' 
                variant='standard' 
                fullWidth
                value={employerName}
                onChange={({ target }) => setEmployerName(target.value)}
              /> <br />
              <InputLabel sx={{ marginTop: '1rem' }}>Sick Leaves (optional) </InputLabel>
              <TextField 
                sx={{ marginTop: '1rem' }}
                label='StartDate' 
                type='date'
                variant='standard' 
                fullWidth 
                value={startDate}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={({ target }) => setStartDate(target.value)}
                /> <br />
              <TextField 
                sx={{ marginTop: '1rem' }}
                label='EndDate' 
                type='date'
                variant='standard' 
                fullWidth
                value={endDate}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={({ target }) => setEndDate(target.value)}
                /> <br />
              </div>
            }
            { entry === 'Hospital' &&
            <div>
              <Typography variant="subtitle1" sx={{ marginTop: '1rem' }}>Discharge</Typography>
              <TextField 
                sx={{ marginTop: '1rem' }}
                label='Date' 
                type='date'
                variant='standard' 
                fullWidth 
                value={dischargeDate}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={({ target }) => setDischargeDate(target.value)}
                /> <br />
              <TextField 
                label='Criteria' 
                variant='standard' 
                fullWidth
                value={dischargeCriteria}
                onChange={({ target }) => setDischargeCriteria(target.value)}
                /> <br />
              </div>
            }
            <Button 
              sx={{marginTop: '20px', position: 'relative', right: '-3px', bgcolor: 'red'}} 
              variant='contained' 
              onClick={() => {
                setIsVisible(!isVisible);
                emptyState();
              }}
              >CANCEL</Button>
            <Button 
              sx={{marginTop: '20px', position: 'relative', left: '20rem', bgcolor: 'lightgrey'}}
              variant='contained' 
              type='submit'
              onClick={(event: SyntheticEvent) => {
                event.preventDefault();
                setIsVisible(!isVisible);
                addEntry(patient.id.toString());
                }}
              >ADD</Button>
          </Box>
          }
          <h4>entries</h4>
          {notify && <Alert severity="error">{notify}</Alert>}
          {patient.entries.map((e) => {
            const diagnoseCodes = e.diagnosisCodes;
            return (
              <Box key={e.id} sx={{ p: '3', border: '1px solid grey', borderRadius: '5px' }}>
                <span>{e.date}</span>
                <EntryDetails entry={e} desc={e.description} />
                {diagnoseCodes && <p>diagnoses: </p>}
                <ul>
                  {diagnoseCodes?.map((code) => {
                    fetchDiagnosename(code);
                    return (
                    <li key={code}>
                      {code} {diagnoseNames[code] || 'Loading...'}
                    </li>
                  );
                })};
                </ul>
                <p>diagnose by {e.specialist}</p>
              </Box>
            );
          })}
          </Stack>
        </>
        ) : ''}
      {isVisible &&
      <Box sx={{ marginTop: 2 }}>
        <Button onClick={() => setIsVisible(!isVisible)} variant="contained" color="primary" >ADD NEW ENTRY</Button>
      </Box>
      }
      </Container>
    </div>
  );
};

export default PatientInfo;