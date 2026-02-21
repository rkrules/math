interface TimerBarProps {
  timeLeft: number
  totalTime: number
  enabled: boolean
}

export default function TimerBar({ timeLeft, totalTime, enabled }: TimerBarProps) {
  const pct = (timeLeft / totalTime) * 100
  const isDanger = timeLeft <= 3 && timeLeft > 0

  return (
    <div className="timer-bar-wrapper">
      {enabled ? (
        <div className="timer-bar-track">
          <div
            className={`timer-bar-fill${isDanger ? ' timer-bar-fill--danger' : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : (
        /* Invisible placeholder — keeps layout stable when timer is off */
        <div className="timer-bar-track" style={{ background: 'transparent' }} />
      )}
    </div>
  )
}
