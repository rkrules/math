interface ResultScreenProps {
  score: number
  totalQuestions: number
  tableLabel: string
  onReplay: () => void
}

function getEncouragement(score: number, total: number): string {
  const pct = score / total
  if (pct === 1)   return "PERFECT! You're a Squish Champion! 🏆"
  if (pct >= 0.9)  return "Amazing! Almost perfect — keep it up! 🌟"
  if (pct >= 0.7)  return "Great job! You're getting squishier every time! 🌸"
  if (pct >= 0.5)  return "Good try! Practice makes a Squish Master! 💪"
  return "Keep going! Every Squishmallow started somewhere! 🤍"
}

function getMascot(score: number, total: number): string {
  const pct = score / total
  if (pct === 1)  return '🏆'
  if (pct >= 0.8) return '⭐'
  if (pct >= 0.5) return '🌸'
  return '🌷'
}

function getStars(score: number, total: number): string {
  const filled = Math.round((score / total) * 5)
  return '⭐'.repeat(filled) + '✨'.repeat(Math.max(0, 5 - filled))
}

export default function ResultScreen({
  score,
  totalQuestions,
  tableLabel,
  onReplay,
}: ResultScreenProps) {
  return (
    <div className="result-screen">
      <div className="result-mascot">{getMascot(score, totalQuestions)}</div>

      <h2 className="result-title">You finished!</h2>

      <div className="result-score-display">
        <div className="result-score-number">
          {score}/{totalQuestions}
        </div>
        <div className="result-score-label">
          {tableLabel === 'Random Mix' ? '🎲 Random Mix mode' : `on the ${tableLabel} table`}
        </div>
      </div>

      <div className="result-stars">{getStars(score, totalQuestions)}</div>

      <p className="result-message">
        {getEncouragement(score, totalQuestions)}
      </p>

      <div className="result-actions">
        <button className="btn-primary" onClick={onReplay}>
          Play Again! 🌟
        </button>
      </div>
    </div>
  )
}
