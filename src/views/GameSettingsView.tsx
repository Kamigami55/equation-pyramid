"use client";

import { PLAYERS_OPTIONS, ROUNDS_OPTIONS } from "@/constants";
import { Typography } from "@/components/Typography";
import { RoundButton } from "@/components/RoundButton";
import { Button } from "@/components/Button";

interface GameSettingsViewProps {
  numPlayers: number;
  numRounds: number;
  onConfigUpdate: (config: { numPlayers?: number; numRounds?: number }) => void;
  onStartGame: () => void;
}

export function GameSettingsView({
  numPlayers,
  numRounds,
  onConfigUpdate,
  onStartGame,
}: GameSettingsViewProps) {
  return (
    <div className="flex flex-col items-center gap-20">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-6">
        <Typography variant="h1" className="text-center">
          Game Setup
        </Typography>
        <Typography variant="p1" className="text-center">
          Choose number of player and round
        </Typography>
      </div>

      {/* Button Groups */}
      <div className="flex flex-col items-center gap-20">
        {/* Number of Players */}
        <div className="flex flex-col items-center gap-6">
          <Typography variant="h2" className="text-center">
            Number of Player
          </Typography>
          <div className="flex items-center justify-center gap-[72px]">
            {PLAYERS_OPTIONS.map((option) => (
              <RoundButton
                key={option}
                onClick={() => onConfigUpdate({ numPlayers: option })}
                isActive={numPlayers === option}
              >
                {option}
              </RoundButton>
            ))}
          </div>
        </div>

        {/* Number of Rounds */}
        <div className="flex flex-col items-center gap-6">
          <Typography variant="h2">Number of Round</Typography>
          <div className="flex items-center justify-center gap-[72px] p-2.5">
            {ROUNDS_OPTIONS.map((option) => (
              <RoundButton
                key={option}
                onClick={() => onConfigUpdate({ numRounds: option })}
                isActive={numRounds === option}
                // style={{ width: "136px", height: "136px" }}
              >
                {option}
              </RoundButton>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <Button onClick={onStartGame} variant="primary">
        Start
      </Button>
    </div>
  );
}
