import express from 'express';
import diagnosesService from '../services/diagnosesService';
const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diagnosesService.getEntries());
});

router.get('/:code', (req, res) => {
  const diagnose = diagnosesService.getInfo(String(req.params.code));

  if (diagnose) {
    res.send(diagnose);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (_req, res) => {
  res.send('Saving a diagnose!');
});

export default router;