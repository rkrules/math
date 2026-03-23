
import { Operation, GameMode } from '../utils/mathUtils';
import { Plus, Minus, X, Divide, Grid3X3, RotateCcw, ArrowLeftRight, PieChart } from 'lucide-react';

interface OperationSelectorProps {
  selectedOperation: Operation;
  onSelectOperation: (operation: Operation) => void;
  gameMode: GameMode;
  onChangeGameMode: (mode: GameMode) => void;
  selectedOperations: Operation[];
  onToggleOperation: (operation: Operation) => void;
  selectedTable: number | null;
  onSelectTable: (table: number | null) => void;
  sessionDuration: number;
  onChangeSessionDuration: (duration: number) => void;
  squishmallowMode: boolean;
  onToggleSquishmallowMode: (enabled: boolean) => void;
}

const operations: { id: Operation; label: string; icon: React.ReactNode }[] = [
  { id: 'addition', label: 'Addition', icon: <Plus size={20} /> },
  { id: 'subtraction', label: 'Subtraction', icon: <Minus size={20} /> },
  { id: 'multiplication', label: 'Multiply', icon: <X size={20} /> },
  { id: 'division', label: 'Division', icon: <Divide size={20} /> },
  { id: 'multiplication_table', label: 'Times Tables', icon: <Grid3X3 size={20} /> },
  { id: 'rounding', label: 'Rounding', icon: <RotateCcw size={20} /> },
  { id: 'comparing', label: 'Comparing', icon: <ArrowLeftRight size={20} /> },
  { id: 'fractions', label: 'Fractions', icon: <PieChart size={20} /> },
];

const tables = Array.from({ length: 12 }, (_, i) => i + 1);

const OperationSelector = ({
  selectedOperation, onSelectOperation,
  gameMode, onChangeGameMode,
  selectedOperations, onToggleOperation,
  selectedTable, onSelectTable,
  sessionDuration, onChangeSessionDuration,
  squishmallowMode, onToggleSquishmallowMode,
}: OperationSelectorProps) => {
  const showTableSelector = gameMode === 'single'
    ? selectedOperation === 'multiplication_table'
    : selectedOperations.includes('multiplication_table');

  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up space-y-4">
      {/* Mode tabs */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onChangeGameMode('single')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            gameMode === 'single'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Single Mode
        </button>
        <button
          onClick={() => onChangeGameMode('practice')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            gameMode === 'practice'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Practice Round
        </button>
      </div>

      {/* Operations grid */}
      <div>
        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-3 text-center">
          {gameMode === 'single' ? 'Select Operation' : 'Select Categories'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {operations.map(op => {
            const isActive = gameMode === 'single'
              ? selectedOperation === op.id
              : selectedOperations.includes(op.id);

            return (
              <button
                key={op.id}
                onClick={() => {
                  if (gameMode === 'single') {
                    onSelectOperation(op.id);
                  } else {
                    onToggleOperation(op.id);
                  }
                }}
                data-active={isActive}
                className="operation-button flex-col gap-1 py-3"
              >
                <span className={`transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {op.icon}
                </span>
                <span className="text-xs font-medium">{op.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Times table sub-selector */}
      {showTableSelector && (
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wider text-muted-foreground text-center">
            Which Table?
          </p>
          <div className="grid grid-cols-6 gap-2 max-w-xs mx-auto">
            <button
              onClick={() => onSelectTable(null)}
              data-active={selectedTable === null}
              className="operation-button py-2 text-sm"
            >
              All
            </button>
            {tables.map(t => (
              <button
                key={t}
                onClick={() => onSelectTable(t)}
                data-active={selectedTable === t}
                className="operation-button py-2 text-sm"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Practice round duration */}
      {gameMode === 'practice' && (
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wider text-muted-foreground text-center">
            Duration
          </p>
          <div className="flex justify-center gap-3">
            {[10, 15].map(min => (
              <button
                key={min}
                onClick={() => onChangeSessionDuration(min * 60)}
                data-active={sessionDuration === min * 60}
                className="operation-button px-6 py-2 w-auto"
              >
                {min} min
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Squishmallow Mode toggle */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => onToggleSquishmallowMode(!squishmallowMode)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            squishmallowMode
              ? 'bg-pink-200 text-pink-800 shadow-md ring-2 ring-pink-300'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          🧸 Squishmallow Mode
        </button>
      </div>
    </div>
  );
};

export default OperationSelector;
