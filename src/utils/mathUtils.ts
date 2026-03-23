
export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'multiplication_table' | 'rounding' | 'comparing' | 'fractions';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'single' | 'practice';

export interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  correctAnswer: number;
  displayText?: string;
  options?: { label: string; value: number }[];
}

interface DifficultyRange {
  min: number;
  max: number;
}

const difficultyRanges: Record<Difficulty, DifficultyRange> = {
  easy: { min: 1, max: 10 },
  medium: { min: 5, max: 20 },
  hard: { min: 10, max: 50 },
};

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateQuestion = (operation: Operation, difficulty: Difficulty, selectedTable?: number | null): Question => {
  const { min, max } = difficultyRanges[difficulty];

  switch (operation) {
    case 'addition': {
      const num1 = randInt(min, max);
      const num2 = randInt(min, max);
      return { num1, num2, operation, correctAnswer: num1 + num2 };
    }

    case 'subtraction': {
      let num1 = randInt(min, max);
      let num2 = randInt(min, max);
      if (num1 < num2) [num1, num2] = [num2, num1];
      return { num1, num2, operation, correctAnswer: num1 - num2 };
    }

    case 'multiplication': {
      let num1 = randInt(min, max);
      let num2 = randInt(min, max);
      if (difficulty === 'medium') { num1 = Math.min(num1, 12); num2 = Math.min(num2, 15); }
      else if (difficulty === 'hard') { num1 = Math.min(num1, 25); num2 = Math.min(num2, 15); }
      return { num1, num2, operation, correctAnswer: num1 * num2 };
    }

    case 'division': {
      const divisors = { easy: [1,2,3,4,5], medium: [2,3,4,5,6,7,8,9], hard: [3,4,5,6,7,8,9,10,11,12] };
      const divList = divisors[difficulty];
      const num2 = divList[randInt(0, divList.length - 1)];
      const quotient = randInt(min, difficulty === 'hard' ? 15 : max);
      const num1 = num2 * quotient;
      return { num1, num2, operation, correctAnswer: quotient };
    }

    case 'multiplication_table': {
      const table = selectedTable ?? randInt(1, 12);
      const multiplier = randInt(1, 12);
      return { num1: table, num2: multiplier, operation, correctAnswer: table * multiplier };
    }

    case 'rounding': {
      const roundTo = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 100 : 1000;
      const range = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 1000 : 10000;
      const num = randInt(1, range);
      const answer = Math.round(num / roundTo) * roundTo;
      return {
        num1: num, num2: roundTo, operation, correctAnswer: answer,
        displayText: `Round ${num} to the nearest ${roundTo}`
      };
    }

    case 'comparing': {
      const num1 = randInt(min, max * 5);
      let num2 = randInt(min, max * 5);
      if (Math.random() < 0.15) num2 = num1;
      const answer = num1 > num2 ? 1 : num1 < num2 ? -1 : 0;
      return {
        num1, num2, operation, correctAnswer: answer,
        displayText: `Compare: ${num1} ○ ${num2}`,
        options: [
          { label: '<', value: -1 },
          { label: '=', value: 0 },
          { label: '>', value: 1 },
        ]
      };
    }

    case 'fractions': {
      const denoms = difficulty === 'easy' ? [2,3,4] : difficulty === 'medium' ? [2,3,4,5,6] : [2,3,4,5,6,8,10];
      const denom = denoms[randInt(0, denoms.length - 1)];
      const numer = randInt(1, denom - 1);
      const multiplier = randInt(2, difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);
      const newDenom = denom * multiplier;
      const answer = numer * multiplier;
      return {
        num1: numer, num2: denom, operation, correctAnswer: answer,
        displayText: `${numer}/${denom} = ?/${newDenom}`
      };
    }

    default:
      return { num1: 0, num2: 0, operation, correctAnswer: 0 };
  }
};

export const getOperationSymbol = (operation: Operation): string => {
  switch (operation) {
    case 'addition': return '+';
    case 'subtraction': return '−';
    case 'multiplication': return '×';
    case 'division': return '÷';
    case 'multiplication_table': return '×';
    default: return '';
  }
};

export const getOperationName = (op: Operation): string => {
  switch (op) {
    case 'addition': return 'Addition';
    case 'subtraction': return 'Subtraction';
    case 'multiplication': return 'Multiplication';
    case 'division': return 'Division';
    case 'multiplication_table': return 'Times Tables';
    case 'rounding': return 'Rounding';
    case 'comparing': return 'Comparing';
    case 'fractions': return 'Fractions';
    default: return '';
  }
};

export const calculatePoints = (
  isCorrect: boolean, 
  timeTaken: number, 
  streak: number, 
  difficulty: Difficulty
): number => {
  if (!isCorrect) return 0;
  
  const basePoints = { easy: 10, medium: 20, hard: 30 }[difficulty];
  const maxTimeBonus = 25;
  const timeBonus = Math.max(0, maxTimeBonus - timeTaken);
  const streakMultiplier = 1 + Math.floor(streak / 5) * 0.5;
  
  return Math.round((basePoints + timeBonus) * streakMultiplier);
};

export const generateMultipleChoiceOptions = (correctAnswer: number): { label: string; value: number }[] => {
  const options = new Set<number>([correctAnswer]);
  
  // Generate distractors based on common mistake patterns
  const distractors = [
    correctAnswer + 1,
    correctAnswer - 1,
    correctAnswer + 2,
    correctAnswer - 2,
    correctAnswer + 10,
    correctAnswer - 10,
    correctAnswer + 5,
    correctAnswer * 2,
    Math.floor(correctAnswer / 2),
  ].filter(n => n >= 0 && n !== correctAnswer);
  
  // Shuffle and pick 3 unique distractors
  const shuffled = distractors.sort(() => Math.random() - 0.5);
  for (const d of shuffled) {
    if (options.size >= 4) break;
    options.add(d);
  }
  
  // If we still need more, generate random nearby values
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 10) + 1;
    const candidate = Math.random() > 0.5 ? correctAnswer + offset : Math.max(0, correctAnswer - offset);
    if (!options.has(candidate)) options.add(candidate);
  }
  
  // Convert to array and shuffle
  return Array.from(options)
    .sort(() => Math.random() - 0.5)
    .map(value => ({ label: String(value), value }));
};
