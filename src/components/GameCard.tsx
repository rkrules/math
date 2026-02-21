import type { Question, FeedbackState } from '../App'
import TimerBar from './TimerBar'

interface GameCardProps {
  question: Question
  options: number[]
  feedbackState: FeedbackState
  selectedAnswer: number | null
  score: number
  questionIndex: number
  totalQuestions: number
  timeLeft: number
  totalTime: number
  timerEnabled: boolean
  onAnswer: (value: number) => void
}

const MASCOTS = ['🌸', '🌷', '🦋', '🌈', '⭐', '🍭', '🎀', '🌺']

function getMascot(index: number) {
  return MASCOTS[index % MASCOTS.length]
}

function getFeedbackMessage(
  feedbackState: FeedbackState,
  correctAnswer: number
): string {
  switch (feedbackState) {
    case 'correct':
      return '✨ Squish-tastic! That\'s right!'
    case 'wrong':
      return `💭 So close! The answer is ${correctAnswer}.`
    case 'timeout':
      return `⏰ Time\'s up! The answer was ${correctAnswer}.`
    default:
      return ''
  }
}

function getOptionClass(
  value: number,
  correctAnswer: number,
  selectedAnswer: number | null,
  feedbackState: FeedbackState
): string {
  if (feedbackState === 'idle') return 'option-btn'
  if (value === correctAnswer) return 'option-btn option-btn--correct'
  if (value === selectedAnswer && feedbackState === 'wrong') return 'option-btn option-btn--wrong'
  return 'option-btn option-btn--dimmed'
}

export default function GameCard({
  question,
  options,
  feedbackState,
  selectedAnswer,
  score,
  questionIndex,
  totalQuestions,
  timeLeft,
  totalTime,
  timerEnabled,
  onAnswer,
}: GameCardProps) {
  const feedbackText = getFeedbackMessage(feedbackState, question.answer)
  const feedbackVisible = feedbackState !== 'idle'

  return (
    <div className="game-card">
      {/* Timer bar */}
      <TimerBar timeLeft={timeLeft} totalTime={totalTime} enabled={timerEnabled} />

      {/* Header */}
      <div className="game-header">
        <span className="game-progress">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <span className="game-score">✅ {score} correct</span>
      </div>

      {/* Question */}
      <div className="question-display">
        <span className="question-mascot">{getMascot(questionIndex)}</span>
        <div className="question-text">
          {question.multiplier} × {question.multiplicand} ={' '}
          <span className="question-mark">?</span>
        </div>
      </div>

      {/* Feedback */}
      <div
        className={`feedback-message${feedbackVisible ? ' feedback-message--visible' : ''} feedback-message--${feedbackState}`}
        aria-live="polite"
      >
        {feedbackText}
      </div>

      {/* Options grid */}
      <div className="options-grid">
        {options.map((opt) => (
          <button
            key={opt}
            className={getOptionClass(opt, question.answer, selectedAnswer, feedbackState)}
            onClick={() => onAnswer(opt)}
            disabled={feedbackState !== 'idle'}
            aria-label={`Answer ${opt}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
