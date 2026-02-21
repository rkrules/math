import { useState, useEffect, useCallback, useRef } from 'react'
import SettingsPanel from './components/SettingsPanel'
import GameCard from './components/GameCard'
import ResultScreen from './components/ResultScreen'

// =============================================
// Types
// =============================================
export type GamePhase = 'settings' | 'playing' | 'finished'
export type OrderMode = 'ordered' | 'random' | 'mix'
export type FeedbackState = 'idle' | 'correct' | 'wrong' | 'timeout'

export interface Question {
  multiplier: number
  multiplicand: number
  answer: number
}

// =============================================
// Utilities
// =============================================
function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateQuestions(table: number, mode: OrderMode): Question[] {
  const multiplicands = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const ordered = mode === 'random' ? fisherYates(multiplicands) : multiplicands
  return ordered.map((m) => ({
    multiplier: table,
    multiplicand: m,
    answer: table * m,
  }))
}

function generateMixQuestions(count: number): Question[] {
  const factors = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const questions: Question[] = []
  for (let i = 0; i < count; i++) {
    const a = factors[Math.floor(Math.random() * factors.length)]
    const b = factors[Math.floor(Math.random() * factors.length)]
    questions.push({ multiplier: a, multiplicand: b, answer: a * b })
  }
  return questions
}

function generateOptions(correctAnswer: number): number[] {
  const distractors = new Set<number>()
  let attempts = 0
  while (distractors.size < 3 && attempts < 200) {
    attempts++
    // Scale offset range so small answers get smaller, tighter offsets
    const range = Math.max(5, Math.floor(correctAnswer * 0.4))
    const offset = Math.floor(Math.random() * range * 2 + 1) - range
    if (offset === 0) continue
    const candidate = correctAnswer + offset
    if (candidate <= 0) continue
    if (candidate === correctAnswer) continue
    distractors.add(candidate)
  }
  // Fallback: if we somehow couldn't fill 3, add safe values
  let fallback = 1
  while (distractors.size < 3) {
    if (fallback !== correctAnswer) distractors.add(fallback)
    fallback++
  }
  return fisherYates([correctAnswer, ...Array.from(distractors)])
}

const TOTAL_TIME = 10

// =============================================
// App
// =============================================
export default function App() {
  // Settings
  const [currentTable, setCurrentTable] = useState<number>(7)
  const [orderMode, setOrderMode] = useState<OrderMode>('ordered')
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true)

  // Game phase
  const [gamePhase, setGamePhase] = useState<GamePhase>('settings')

  // Game data
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [options, setOptions] = useState<number[]>([])
  const [score, setScore] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  // Per-question ephemeral state
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle')
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME)

  // Refs — avoid stale closures
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const questionsRef = useRef<Question[]>([])

  // Keep questionsRef in sync so advance() always sees latest questions
  useEffect(() => {
    questionsRef.current = questions
  }, [questions])

  // ---- Advance to next question or finish ----
  const advance = useCallback(() => {
    setCurrentQuestionIndex((prev) => {
      const qs = questionsRef.current
      const next = prev + 1
      if (next >= qs.length) {
        setGamePhase('finished')
        setFeedbackState('idle')
        setSelectedAnswer(null)
        return prev
      }
      setOptions(generateOptions(qs[next].answer))
      setFeedbackState('idle')
      setSelectedAnswer(null)
      setTimeLeft(TOTAL_TIME)
      return next
    })
  }, [])

  const scheduleAdvance = useCallback(() => {
    if (advanceRef.current) clearTimeout(advanceRef.current)
    advanceRef.current = setTimeout(advance, 1500)
  }, [advance])

  // ---- Effect 1: Start/restart countdown when question changes ----
  useEffect(() => {
    if (gamePhase !== 'playing' || !timerEnabled) return

    setTimeLeft(TOTAL_TIME)

    const id = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    timerRef.current = id
    return () => clearInterval(id)
  }, [gamePhase, currentQuestionIndex, timerEnabled])

  // ---- Effect 2: Detect timeout ----
  useEffect(() => {
    if (timeLeft === 0 && feedbackState === 'idle' && gamePhase === 'playing') {
      if (timerRef.current) clearInterval(timerRef.current)
      setFeedbackState('timeout')
      scheduleAdvance()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  // ---- Effect 3: Global cleanup ----
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (advanceRef.current) clearTimeout(advanceRef.current)
    }
  }, [])

  // ---- Handlers ----
  const handleStartGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (advanceRef.current) clearTimeout(advanceRef.current)

    const qs =
      orderMode === 'mix'
        ? generateMixQuestions(10)
        : generateQuestions(currentTable, orderMode)
    setQuestions(qs)
    questionsRef.current = qs
    setCurrentQuestionIndex(0)
    setOptions(generateOptions(qs[0].answer))
    setScore(0)
    setSelectedAnswer(null)
    setFeedbackState('idle')
    setTimeLeft(TOTAL_TIME)
    setGamePhase('playing')
  }, [currentTable, orderMode])

  const handleAnswer = useCallback(
    (value: number) => {
      if (feedbackState !== 'idle') return

      if (timerRef.current) clearInterval(timerRef.current)
      setSelectedAnswer(value)

      const correct = questionsRef.current[currentQuestionIndex]?.answer
      if (value === correct) {
        setFeedbackState('correct')
        setScore((prev) => prev + 1)
      } else {
        setFeedbackState('wrong')
      }
      scheduleAdvance()
    },
    [feedbackState, currentQuestionIndex, scheduleAdvance]
  )

  const handleReplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (advanceRef.current) clearTimeout(advanceRef.current)
    setGamePhase('settings')
    setFeedbackState('idle')
    setSelectedAnswer(null)
  }, [])

  // ---- Render ----
  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div>
      {gamePhase === 'settings' && (
        <div className="card">
          <SettingsPanel
            currentTable={currentTable}
            orderMode={orderMode}
            timerEnabled={timerEnabled}
            onTableChange={setCurrentTable}
            onOrderChange={setOrderMode}
            onTimerChange={setTimerEnabled}
            onStart={handleStartGame}
          />
        </div>
      )}

      {gamePhase === 'playing' && currentQuestion && (
        <div className="card">
          <GameCard
            question={currentQuestion}
            options={options}
            feedbackState={feedbackState}
            selectedAnswer={selectedAnswer}
            score={score}
            questionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            timeLeft={timeLeft}
            totalTime={TOTAL_TIME}
            timerEnabled={timerEnabled}
            onAnswer={handleAnswer}
          />
        </div>
      )}

      {gamePhase === 'finished' && (
        <div className="card">
          <ResultScreen
            score={score}
            totalQuestions={questions.length}
            tableLabel={orderMode === 'mix' ? 'Random Mix' : `${currentTable}×`}
            onReplay={handleReplay}
          />
        </div>
      )}
    </div>
  )
}
