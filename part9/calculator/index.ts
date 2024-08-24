import express from 'express';
const app = express();
import { bmiCalculator } from './bmiCalculator';
import { exerciseCalculator } from './exerciseCalculator';
import { MultiplyValues } from './exerciseCalculator';

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  const h = Number(height);
  const w = Number(weight);

  try {
    const bmiResult = bmiCalculator(h, w);
    res.json({ height: h, weight: w, bmi: bmiResult});
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send({'error': 'malformatted parameters'});
    }
  }
});

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body as MultiplyValues;

  try {
    const exercisesResult = exerciseCalculator(daily_exercises, target);
    res.json(exercisesResult);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send({'error': 'malformatted parameters'});
    }
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});