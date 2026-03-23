
import { useEffect, useState } from 'react';
import { Difficulty, Operation, GameMode, getOperationName } from '../utils/mathUtils';
import { useTypingEffect } from '../utils/animations';
import CoachReview from './CoachReview';
import { FEATURES } from '../config/features';

interface GameSummaryProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  maxStreak: number;
  averageTime: number;
  difficulty: Difficulty;
  operation: Operation;
  onPlayAgain: () => void;
  gameMode: GameMode;
  selectedOperations: Operation[];
  aiCoachEnabled: boolean;
  wrongAnswers: { question: any, userAnswer: number }[];
}

const GameSummary = ({
  score, totalQuestions, correctAnswers, maxStreak, averageTime,
  difficulty, operation, onPlayAgain, gameMode, selectedOperations,
  aiCoachEnabled, wrongAnswers,
}: GameSummaryProps) => {
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  const getMessage = () => {
    if (accuracy >= 90) return "Excellent work! Your math skills are impressive!";
    if (accuracy >= 70) return "Great job! Keep practicing to get even better!";
    if (accuracy >= 50) return "Good effort! Regular practice will help you improve.";
    return "Keep practicing! Math skills improve with regular practice.";
  };
  
  const message = useTypingEffect(getMessage(), 30);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowPlayAgain(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getDifficultyName = (diff: Difficulty): string => {
    switch (diff) {
      case 'easy': return 'Easy';
      case 'medium': return 'Medium';
      case 'hard': return 'Hard';
      default: return '';
    }
  };

  const modeLabel = gameMode === 'practice'
    ? `Practice Round • ${selectedOperations.map(getOperationName).join(', ')}`
    : `${getOperationName(operation)} • ${getDifficultyName(difficulty)}`;

  return (
    <div className="backdrop-blur-md bg-white/90 shadow-xl rounded-2xl p-8 max-w-md w-full
                  border border-white/40 animate-scale-in space-y-6 mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">Game Summary</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Score</p>
          <p className="text-2xl font-semibold text-primary">{score}</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Accuracy</p>
          <p className="text-2xl font-semibold text-accent">{accuracy}%</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Best Streak</p>
          <p className="text-2xl font-semibold text-secondary">{maxStreak}</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Avg. Time</p>
          <p className="text-2xl font-semibold text-foreground">{averageTime.toFixed(1)}s</p>
        </div>
      </div>
      
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">{modeLabel}</p>
        <p className="text-sm">
          You answered <span className="font-semibold">{correctAnswers}</span> out of{" "}
          <span className="font-semibold">{totalQuestions}</span> questions correctly.
        </p>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-foreground min-h-[3rem]">{message}</p>
      </div>

      {showPlayAgain && FEATURES.AI_COACH_ENABLED && aiCoachEnabled && wrongAnswers.length > 0 && (
        <CoachReview wrongAnswers={wrongAnswers} />
      )}
      
      {showPlayAgain && (
        <button
          onClick={onPlayAgain}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl 
                   text-lg font-medium shadow-lg hover:shadow-primary/25 
                   hover:bg-primary/90 transition-all animate-fade"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default GameSummary;
