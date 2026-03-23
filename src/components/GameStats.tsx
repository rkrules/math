
import { useAnimatedNumber } from '../utils/animations';
import { Infinity } from 'lucide-react';

interface GameStatsProps {
  score: number;
  streak: number;
  timeLeft: number;
  maxTime: number;
  timerEnabled: boolean;
  sessionTimeLeft?: number | null;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.ceil(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const GameStats = ({ score, streak, timeLeft, maxTime, timerEnabled, sessionTimeLeft }: GameStatsProps) => {
  const animatedScore = useAnimatedNumber(score);
  const animatedStreak = useAnimatedNumber(streak);

  return (
    <div className="game-stats-card animate-fade space-y-3">
      {/* Session timer for practice mode */}
      {sessionTimeLeft != null && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Session Time</p>
          <p className={`text-2xl font-bold tabular-nums ${
            sessionTimeLeft < 60 ? 'text-destructive' : 'text-primary'
          }`}>
            {formatTime(sessionTimeLeft)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Score</p>
          <p className="text-2xl font-semibold text-primary">{animatedScore}</p>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Streak</p>
          <div className="flex items-center justify-center">
            <p className={`text-2xl font-semibold ${streak > 0 ? 'text-secondary' : 'text-muted-foreground'}`}>
              {animatedStreak}
            </p>
            {streak >= 5 && (
              <span className="ml-1 text-xs text-secondary font-medium mt-1">
                {Math.floor(streak / 5) > 0 && `×${(1 + Math.floor(streak / 5) * 0.5).toFixed(1)}`}
              </span>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Time</p>
          {timerEnabled ? (
            <div className="relative h-6 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full ${
                  timeLeft < maxTime * 0.25 ? 'bg-destructive' : timeLeft < maxTime * 0.5 ? 'bg-secondary' : 'bg-primary'
                } transition-all duration-200`}
                style={{ width: `${(timeLeft / maxTime) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                {Math.ceil(timeLeft)}s
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-6">
              <Infinity className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStats;
