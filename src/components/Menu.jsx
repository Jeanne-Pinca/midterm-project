// ./src/components/Menu.jsx

// menu that allows the player to reset progress or start a new game in the story screen

import { useGame } from "../context/GameContext";
import "./css/Menu.css";

export default function Menu() {
  const { resetGame, newGame } = useGame();

  return (
    <div className="menu-panel">
      <button className="menu-btn" onClick={resetGame}>
        Reset Progress
      </button>
      <button className="menu-btn" onClick={newGame}>
        Start New Game
      </button>
    </div>
  );
}
