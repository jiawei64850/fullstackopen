import { isNotNumber } from "./utils";

export interface MultiplyValues {
  daily_exercises: Array<number>;
  target: number;
}

const parseArguments = (args: string[]) : MultiplyValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  
  const hoursArray : Array<number> = [];

  for (let i = 3; i < args.length; i++) {
    if (!isNotNumber(i)) {
      hoursArray.push(Number(args[i]));
    } else {
    throw new Error('Provided daily exercises hours were not numbers!');
    }
  }
  
  if (isNotNumber(2)) {
    throw new Error('Provided target hours were not numbers!');
  }
  console.log('hoursArray', hoursArray);
  console.log('target', Number(args[2]));
  
  
  return {
    daily_exercises: hoursArray,
    target: Number(args[2])
  };
};

interface result { 
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const exerciseCalculator = (h : Array<number>, t: number) : result => {
  const periodLength = h.length;
  const trainingDays = h.filter(d => d > 0).length;
  const target = t;
  const totalHours = h.reduce((a, c) => a + c, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= t) {
    rating = 3;
    ratingDescription = 'Great job! You met your target.';
  } else if (average >= t * 0.75) {
    rating = 2;
    ratingDescription = 'Not too bad, but there is room for improvement.';
  } else {
    rating = 1;
    ratingDescription = 'You need to work harder to meet your goals.';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
    const { daily_exercises, target } = parseArguments(process.argv);
    console.log(exerciseCalculator(daily_exercises, target));  
  } catch (error: unknown) {
    let errorMessage = 'something went wrong: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }