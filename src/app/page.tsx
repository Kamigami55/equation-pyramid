"use client";

import Image from "next/image";
import { useMachine } from "@xstate/react";
import { appMachine } from "./state/machine";
import type { Tile } from "./game/types";
import { useEffect } from "react";

function TileComponent({
  tile,
  index,
  isSelected,
  onClick,
}: {
  tile: Tile;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-lg border-2 ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
      }`}
    >
      <div className="text-xl font-bold">{tile.number}</div>
      <div className="text-lg">{tile.operator}</div>
    </button>
  );
}

function PlayerList({
  players,
  onSelectPlayer,
  selectedPlayerId,
}: {
  players: { id: number; name: string; score: number }[];
  onSelectPlayer: (id: number) => void;
  selectedPlayerId: number | null;
}) {
  return (
    <div className="space-y-2">
      {players.map((player) => (
        <button
          type="button"
          key={player.id}
          onClick={() => onSelectPlayer(player.id)}
          className={`w-full p-3 rounded-lg border-2 ${
            selectedPlayerId === player.id
              ? "border-green-500 bg-green-50"
              : "border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{player.name}</span>
            <span className="text-lg font-bold">Score: {player.score}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function Timer({ seconds }: { seconds: number }) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return (
    <div className="text-2xl font-bold">
      {minutes}:{remainingSeconds.toString().padStart(2, "0")}
    </div>
  );
}

export default function Home() {
  const [state, send] = useMachine(appMachine);
  const {
    gameState,
    selectedTiles,
    config,
    mainTimer,
    guessTimer,
    guessingPlayerId,
  } = state.context;

  // Update timers
  useEffect(() => {
    if (state.value === "game" && mainTimer > 0) {
      const timer = setInterval(() => {
        send({ type: "UPDATE_TIMER" });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.value, mainTimer, send]);

  useEffect(() => {
    if (state.value === "guessing" && guessTimer > 0) {
      const timer = setInterval(() => {
        send({ type: "UPDATE_GUESS_TIMER" });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.value, guessTimer, send]);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Equation Pyramid</h1>

          {/* Menu State */}
          {state.value === "menu" && (
            <button
              type="button"
              onClick={() => send({ type: "START" })}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start New Game
            </button>
          )}

          {/* Config State */}
          {state.value === "config" && (
            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <label htmlFor="numPlayers" className="font-medium">
                  Number of Players:
                </label>
                <select
                  id="numPlayers"
                  value={config.numPlayers}
                  onChange={(e) =>
                    send({
                      type: "CONFIG_UPDATE",
                      config: { numPlayers: Number.parseInt(e.target.value) },
                    })
                  }
                  className="p-2 border rounded"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 items-center">
                <label htmlFor="numRounds" className="font-medium">
                  Number of Rounds:
                </label>
                <select
                  id="numRounds"
                  value={config.numRounds}
                  onChange={(e) =>
                    send({
                      type: "CONFIG_UPDATE",
                      config: { numRounds: Number.parseInt(e.target.value) },
                    })
                  }
                  className="p-2 border rounded"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => send({ type: "START_GAME" })}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Start Game
              </button>
            </div>
          )}

          {/* Game State */}
          {state.value === "game" && gameState && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                  Round {config.currentRound} of {config.numRounds}
                </div>
                <Timer seconds={mainTimer} />
              </div>

              <div className="text-2xl font-bold">
                Target Number: {gameState.targetNumber}
              </div>

              <div className="grid grid-cols-5 gap-4">
                {gameState.tiles.map((tile, index) => (
                  <TileComponent
                    key={`tile-${index}-${tile.number}-${tile.operator}`}
                    tile={tile}
                    index={index}
                    isSelected={selectedTiles.includes(index)}
                    onClick={() =>
                      send({ type: "SELECT_TILE", tileIndex: index })
                    }
                  />
                ))}
              </div>

              <div className="flex justify-between items-center">
                <PlayerList
                  players={config.players}
                  onSelectPlayer={(id) =>
                    send({ type: "SELECT_PLAYER", playerId: id })
                  }
                  selectedPlayerId={guessingPlayerId}
                />
                <button
                  type="button"
                  onClick={() => send({ type: "GUESS" })}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Make a Guess
                </button>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2">Found Equations:</h2>
                <div className="space-y-2">
                  {state.context.foundEquations.map((key) => {
                    const [i, j, k] = key.split(",").map(Number);
                    const tiles = [
                      gameState.tiles[i],
                      gameState.tiles[j],
                      gameState.tiles[k],
                    ];
                    return (
                      <div key={key} className="p-2 bg-gray-100 rounded">
                        {tiles[0].number} {tiles[1].operator} {tiles[2].number}{" "}
                        = {gameState.targetNumber}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Guessing State */}
          {state.value === "guessing" && gameState && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">Guessing Time!</div>
                <Timer seconds={guessTimer} />
              </div>

              <div className="text-2xl font-bold">
                Target Number: {gameState.targetNumber}
              </div>

              <div className="grid grid-cols-5 gap-4">
                {gameState.tiles.map((tile, index) => (
                  <TileComponent
                    key={`tile-${index}-${tile.number}-${tile.operator}`}
                    tile={tile}
                    index={index}
                    isSelected={selectedTiles.includes(index)}
                    onClick={() =>
                      send({ type: "SELECT_TILE", tileIndex: index })
                    }
                  />
                ))}
              </div>

              <div className="flex justify-between items-center">
                <PlayerList
                  players={config.players}
                  onSelectPlayer={(id) =>
                    send({ type: "SELECT_PLAYER", playerId: id })
                  }
                  selectedPlayerId={guessingPlayerId}
                />
                <button
                  type="button"
                  onClick={() => send({ type: "CHECK_EQUATION" })}
                  disabled={selectedTiles.length !== 3 || !guessingPlayerId}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    selectedTiles.length === 3 && guessingPlayerId
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Check Equation
                </button>
              </div>
            </div>
          )}

          {/* Round Result State */}
          {state.value === "roundResult" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">
                Round {config.currentRound} Complete!
              </h2>
              <div className="space-y-4">
                {config.players.map((player) => (
                  <div
                    key={player.id}
                    className="p-4 bg-white rounded-lg shadow"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{player.name}</span>
                      <span className="text-lg font-bold">
                        Score: {player.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => send({ type: "NEXT_ROUND" })}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {config.currentRound >= config.numRounds
                  ? "View Final Results"
                  : "Next Round"}
              </button>
            </div>
          )}

          {/* Final Result State */}
          {state.value === "finalResult" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Game Complete!</h2>
              <div className="space-y-4">
                {config.players
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <div
                      key={player.id}
                      className="p-4 bg-white rounded-lg shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold">
                            #{index + 1}
                          </span>
                          <span className="font-medium">{player.name}</span>
                        </div>
                        <span className="text-lg font-bold">
                          Score: {player.score}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => send({ type: "CONTINUE" })}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={() => send({ type: "EXIT" })}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Exit to Menu
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
