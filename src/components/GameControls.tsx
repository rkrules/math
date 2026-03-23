
import { Difficulty, GameMode } from '../utils/mathUtils';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Volume2, VolumeX } from 'lucide-react';
import { FEATURES } from '../config/features';

interface GameControlsProps {
  difficulty: Difficulty;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  onStartGame: () => void;
  onEndGame: () => void;
  isGameActive: boolean;
  timerEnabled: boolean;
  onToggleTimer: (enabled: boolean) => void;
  timePerQuestion: number;
  onChangeTime: (time: number) => void;
  gameMode: GameMode;
  canStart: boolean;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  aiCoachEnabled: boolean;
  onToggleAiCoach: (enabled: boolean) => void;
  multipleChoiceEnabled: boolean;
  onToggleMultipleChoice: (enabled: boolean) => void;
}

const GameControls = ({
  difficulty, onChangeDifficulty, 
  onStartGame, onEndGame, isGameActive,
  timerEnabled, onToggleTimer,
  timePerQuestion, onChangeTime,
  gameMode, canStart,
  soundEnabled, onToggleSound,
  aiCoachEnabled, onToggleAiCoach,
  multipleChoiceEnabled, onToggleMultipleChoice,
}: GameControlsProps) => {
  return (
    <div className="w-full max-w-md mx-auto animate-scale-in">
      {!isGameActive ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-wider text-muted-foreground text-center">
              Select Difficulty
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => onChangeDifficulty(d)}
                  data-active={difficulty === d}
                  className="operation-button capitalize"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Per-question timer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground uppercase tracking-wider">
                Timer
              </label>
              <Switch checked={timerEnabled} onCheckedChange={onToggleTimer} />
            </div>
            {timerEnabled && (
              <div className="flex items-center gap-3">
                <Slider
                  min={5}
                  max={60}
                  step={5}
                  value={[timePerQuestion]}
                  onValueChange={([v]) => onChangeTime(v)}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-muted-foreground w-10 text-right">
                  {timePerQuestion}s
                </span>
              </div>
            )}
          </div>

          {/* Sound toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">
              Sound
            </label>
            <button
              onClick={() => onToggleSound(!soundEnabled)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} className="text-muted-foreground" />}
            </button>
          </div>

          {/* Multiple Choice toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground uppercase tracking-wider">
              Multiple Choice
            </label>
            <Switch checked={multipleChoiceEnabled} onCheckedChange={onToggleMultipleChoice} />
          </div>

          {/* AI Coach toggle */}
          {FEATURES.AI_COACH_ENABLED && (
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground uppercase tracking-wider">
                AI Coach
              </label>
              <Switch checked={aiCoachEnabled} onCheckedChange={onToggleAiCoach} />
            </div>
          )}
          
          <button
            onClick={onStartGame}
            disabled={!canStart}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-lg font-medium 
                     shadow-lg hover:shadow-primary/25 hover:bg-primary/90 transition-all
                     disabled:opacity-50 disabled:pointer-events-none"
          >
            {gameMode === 'practice' ? 'Start Practice' : 'Start Game'}
          </button>
        </div>
      ) : (
        <button
          onClick={onEndGame}
          className="w-full bg-muted hover:bg-muted/70 text-muted-foreground py-2 rounded-xl 
                   text-sm font-medium transition-all mt-4"
        >
          End Game
        </button>
      )}
    </div>
  );
};

export default GameControls;
