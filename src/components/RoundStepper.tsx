import { cn } from "@/lib/utils";

interface RoundStepperProps {
  currentRound: number;
  totalRounds: number;
  onRoundClick?: (round: number) => void;
  selectedRound?: number;
}

export function RoundStepper({
  currentRound,
  totalRounds,
  onRoundClick,
  selectedRound,
}: RoundStepperProps) {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: totalRounds }, (_, i) => i + 1).map((round) => (
        <div key={round} className="flex items-center">
          <button
            type="button"
            className={cn(
              onRoundClick && "cursor-pointer",
              // Add touch-friendly tap target size
              "p-1 md:p-0.5 -m-1 md:-m-0.5",
            )}
            onClick={() => onRoundClick?.(round)}
            disabled={!onRoundClick}
          >
            <div
              className={cn(
                "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors",
                round === (selectedRound || currentRound)
                  ? "bg-white/60"
                  : "bg-white/20",
              )}
            />
          </button>
          {round < totalRounds && (
            <div className="w-4 md:w-5 lg:w-6 h-0 border-t-1 border-white/20" />
          )}
        </div>
      ))}
    </div>
  );
}
