
import { useState, useEffect, useRef } from 'react';
import { Question, getOperationSymbol } from '../utils/mathUtils';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: number) => void;
  isAnswerCorrect: boolean | null;
  showFeedback: boolean;
  squishmallowMode?: boolean;
}

const squishCorrectEmojis = ['🎀', '🌸', '✨', '💖', '🧸', '🌈', '⭐'];
const squishIncorrectEmojis = ['🫂', '💗', '🌷', '🧁'];

const QuestionCard = ({ question, onAnswer, isAnswerCorrect, showFeedback, squishmallowMode }: QuestionCardProps) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setUserAnswer('');
    if (inputRef.current) inputRef.current.focus();
  }, [question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAnswer = parseInt(userAnswer, 10);
    if (!isNaN(numAnswer)) onAnswer(numAnswer);
  };

  const handleOptionClick = (value: number) => {
    if (!showFeedback) onAnswer(value);
  };

  const getBorderColor = () => {
    if (!showFeedback) return '';
    return isAnswerCorrect ? 'ring-2 ring-green-400 border-green-400' : 'ring-2 ring-red-400 border-red-400';
  };

  const isStandardArithmetic = ['addition', 'subtraction', 'multiplication', 'division', 'multiplication_table'].includes(question.operation);

  return (
    <div className={`question-card ${getBorderColor()} animate-scale-in mx-auto`}>
      {/* Question display */}
      {isStandardArithmetic ? (
        <div className="flex items-center justify-center text-4xl font-semibold mb-8">
          <span>{question.num1}</span>
          <span className="math-symbol mx-4">{getOperationSymbol(question.operation)}</span>
          <span>{question.num2}</span>
          <span className="math-symbol mx-4">=</span>
          <span>?</span>
        </div>
      ) : question.operation === 'comparing' ? (
        <div className="flex items-center justify-center text-4xl font-semibold mb-8 gap-4">
          <span>{question.num1}</span>
          <span className="text-primary text-3xl">○</span>
          <span>{question.num2}</span>
        </div>
      ) : (
        <div className="text-center mb-8">
          <p className="text-2xl font-semibold">{question.displayText}</p>
        </div>
      )}

      {/* Answer input */}
      {question.options ? (
        <div className="grid grid-cols-3 gap-3">
          {question.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleOptionClick(opt.value)}
              disabled={showFeedback}
              className="bg-primary/10 hover:bg-primary/20 text-foreground py-4 rounded-xl 
                       text-2xl font-bold transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            ref={inputRef}
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="number-input"
            placeholder="Your answer"
            disabled={showFeedback}
            autoFocus
          />
          <button
            type="submit"
            disabled={!userAnswer || showFeedback}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl 
                     text-lg font-medium shadow-md hover:shadow-lg hover:bg-primary/90 
                     transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            Submit
          </button>
        </form>
      )}
      
      {showFeedback && (
        <div className="mt-4 text-center animate-fade">
          {isAnswerCorrect ? (
            <div>
              {squishmallowMode && (
                <p className="text-2xl mb-1">{squishCorrectEmojis[Math.floor(Math.random() * squishCorrectEmojis.length)]}</p>
              )}
              <p className="text-green-500 font-medium">
                {squishmallowMode ? 'Amazing, you squishy genius!' : 'Correct!'}
              </p>
            </div>
          ) : (
            <div>
              {squishmallowMode && (
                <p className="text-2xl mb-1">{squishIncorrectEmojis[Math.floor(Math.random() * squishIncorrectEmojis.length)]}</p>
              )}
              <p className="text-red-500 font-medium">
                {squishmallowMode ? `Almost! It's ` : 'Incorrect. The answer is '}
                {question.options
                  ? question.options.find(o => o.value === question.correctAnswer)?.label
                  : question.correctAnswer}
                {squishmallowMode ? ' 💕' : '.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
