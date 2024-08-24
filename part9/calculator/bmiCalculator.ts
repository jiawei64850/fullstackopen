import { isNotNumber } from "./utils";

interface MultiplyValues {
  h: number;
  w: number;
}

const parseArguments = (args: string[]): MultiplyValues => {
  if (args.length < 4) throw new Error('Not enough erguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNotNumber(2) && !isNotNumber(3)) {
    return {
      h: Number(args[2]),
      w: Number(args[3])
    };
  } else {
    throw new Error('Provided weight or height were not numbers!');
  }
};

export const bmiCalculator = (h: number, w: number) : string => {
  if (h === 0) throw new Error('Can\'t not use 0 cm height');
  if (w === 0) throw new Error('Can\'t not use 0 kg weight');
  const heightInMeters = h / 100;
  const bmi =  +(w / (heightInMeters * heightInMeters)).toFixed(1);
  if (bmi < 18.5)
    return 'Underweight';
  else if (bmi >= 18.5 && bmi < 25)
    return 'Normal range';
  else
    return "Overweight";
};

try {
  const { h, w } = parseArguments(process.argv);
  console.log(bmiCalculator(h, w));
} catch (error: unknown) {
  let errorMessage = 'something went wrong: ';
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}