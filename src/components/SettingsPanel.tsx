import type { OrderMode } from '../App'

interface SettingsPanelProps {
  currentTable: number
  orderMode: OrderMode
  timerEnabled: boolean
  onTableChange: (table: number) => void
  onOrderChange: (mode: OrderMode) => void
  onTimerChange: (enabled: boolean) => void
  onStart: () => void
}

export default function SettingsPanel({
  currentTable,
  orderMode,
  timerEnabled,
  onTableChange,
  onOrderChange,
  onTimerChange,
  onStart,
}: SettingsPanelProps) {
  return (
    <div className="settings-panel">
      <div className="settings-mascot">🌸</div>

      <div>
        <h1 className="settings-title">
          Squish <span>&amp;</span> Times!
        </h1>
        <p className="settings-subtitle">The squishiest multiplication game</p>
      </div>

      <div className="settings-form">
        {/* Times table picker */}
        <div
          className="settings-field"
          style={
            orderMode === 'mix'
              ? { opacity: 0.4, pointerEvents: 'none', userSelect: 'none' }
              : undefined
          }
        >
          <label className="settings-label" htmlFor="table-select">
            Times Table
          </label>
          <select
            id="table-select"
            className="settings-select"
            value={currentTable}
            onChange={(e) => onTableChange(Number(e.target.value))}
          >
            {Array.from({ length: 11 }, (_, i) => i + 2).map((n) => (
              <option key={n} value={n}>
                {n} times table
              </option>
            ))}
          </select>
        </div>

        {/* Question order */}
        <div className="settings-field">
          <span className="settings-label">Question Order</span>
          <div className="radio-group" style={{ flexWrap: 'wrap' }}>
            <div className="radio-option">
              <input
                type="radio"
                id="order-ordered"
                name="order"
                value="ordered"
                checked={orderMode === 'ordered'}
                onChange={() => onOrderChange('ordered')}
              />
              <label htmlFor="order-ordered">📋 In Order</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="order-random"
                name="order"
                value="random"
                checked={orderMode === 'random'}
                onChange={() => onOrderChange('random')}
              />
              <label htmlFor="order-random">🔀 Random</label>
            </div>
            <div className="radio-option" style={{ flexBasis: '100%' }}>
              <input
                type="radio"
                id="order-mix"
                name="order"
                value="mix"
                checked={orderMode === 'mix'}
                onChange={() => onOrderChange('mix')}
              />
              <label htmlFor="order-mix">🎲 Random Mix (any table!)</label>
            </div>
          </div>
        </div>

        {/* Timer toggle */}
        <div className="settings-field">
          <span className="settings-label">Timer</span>
          <label className="toggle-row" htmlFor="timer-toggle">
            <span className="toggle-row-label">
              ⏱️ Countdown (10 sec per question)
            </span>
            <span className="toggle-switch">
              <input
                type="checkbox"
                id="timer-toggle"
                checked={timerEnabled}
                onChange={(e) => onTimerChange(e.target.checked)}
              />
              <span className="toggle-track" />
            </span>
          </label>
        </div>
      </div>

      <button className="btn-primary" onClick={onStart}>
        Start Game! 🌟
      </button>
    </div>
  )
}
