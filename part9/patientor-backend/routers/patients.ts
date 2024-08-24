import express from 'express';
import patientsService from '../services/patientsService';
import toNewPatientEntry from '../utils';
import toNewEntry from '../utils_entry';
const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientsService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  const patient = patientsService.findById(String(req.params.id));

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.get('/:id/entries', (req, res) => {
  const patient = patientsService.findById(String(req.params.id));

  if (patient) {
    res.send(patient.entries);
  } else {
    res.sendStatus(404);
  }
})

router.post('/', (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addPatientEntry = patientsService.addPatient(newPatientEntry);
    res.json(addPatientEntry);
  } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const patientId = String(req.params.id)
    const newEntry = toNewEntry(req.body);
    console.log(newEntry);
    const addEntry = patientsService.addPatientEntry(patientId, newEntry);
    res.json(addEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
  }
  res.status(400).send(errorMessage);
  }
});

export default router;