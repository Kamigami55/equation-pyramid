"use client";

import { HomeView } from "@/views/HomeView";
import { GameSettingsView } from "@/views/GameSettingsView";
import { GamePlayingView } from "@/views/GamePlayingView";
import { GameOverView } from "@/views/GameOverView";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useGameStore } from "@/logic/state/gameStore";
import { DEBUG } from "@/constants";

export default function AppPage() {
  const {
    currentState,
    config,
    players,
    gameState,
    guessingPlayerId,
    mainTimer,
    start,
    updateConfig,
    startGame,
    selectTile,
    continueGame,
  } = useGameStore();

  const tiles = gameState?.tiles ?? [];
  const selectedPlayerId = guessingPlayerId;
  const timeRemaining = mainTimer;

  const handleConfigUpdate = (newConfig: {
    numPlayers?: number;
    numRounds?: number;
  }) => {
    updateConfig(newConfig);
  };

  return (
    <div className="min-h-screen bg-[#0a0c11] text-white flex flex-col">
      <Header />

      <main className="flex-1">
        {currentState === "menu" && (
          <HomeView onStart={start} onTutorialClick={() => {}} />
        )}

        {currentState === "config" && (
          <GameSettingsView
            numPlayers={config.numPlayers}
            numRounds={config.numRounds}
            onConfigUpdate={handleConfigUpdate}
            onStartGame={startGame}
          />
        )}

        {(currentState === "game" || currentState === "guessing") && (
          <GamePlayingView
            tiles={tiles}
            players={players}
            selectedPlayerId={selectedPlayerId}
            timeRemaining={timeRemaining}
            onTileClick={selectTile}
            DEBUG={DEBUG}
          />
        )}

        {currentState === "roundOver" && (
          <GamePlayingView
            tiles={tiles}
            players={players}
            selectedPlayerId={selectedPlayerId}
            timeRemaining={timeRemaining}
            onTileClick={selectTile}
            isOver={true}
            DEBUG={DEBUG}
          />
        )}

        {currentState === "gameOver" && (
          <GameOverView players={players} onNewGame={continueGame} />
        )}
      </main>

      <Footer />
    </div>
  );
}
