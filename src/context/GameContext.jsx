// ./src/context/GameContext.jsx
//avoids prop drilling  

import { createContext, useContext, useState, useEffect } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
  // Load from localStorage if available
  const loadState = () => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved) : null;
  };

  const savedState = loadState();

  const [hp, setHp] = useState(savedState?.hp ?? 100);
  const [inventory, setInventory] = useState(savedState?.inventory ?? []);
  const [node, setNode] = useState(savedState?.node ?? "start");
  const [progress, setProgress] = useState(savedState?.progress ?? ["start"]);
  const [visitedNodes, setVisitedNodes] = useState(savedState?.visitedNodes ?? []);
  const [playerName, setPlayerName] = useState(savedState?.playerName ?? "");

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "gameState",
      JSON.stringify({
        hp,
        inventory,
        node,
        progress,
        visitedNodes,
        playerName,
      })
    );
  }, [hp, inventory, node, progress, visitedNodes, playerName]);

  // Reset game but keep player name
  const resetGame = () => {
    setHp(100);
    setInventory([]);
    setNode("start");
    setProgress(["start"]);
    setVisitedNodes([]);
  };

  // Full reset, including player name
  const newGame = () => {
    setHp(100);
    setInventory([]);
    setNode("start");
    setProgress(["start"]);
    setVisitedNodes([]);
    setPlayerName("");
    localStorage.removeItem("gameState");
  };

  return (
    <GameContext.Provider
      value={{
        hp,
        setHp,
        inventory,
        setInventory,
        node,
        setNode,
        progress,
        setProgress,
        visitedNodes,
        setVisitedNodes,
        playerName,
        setPlayerName,
        resetGame,
        newGame, 
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
