// ./src/components/StoryScreen.jsx

// Displays the current story node, player stats, and available choices.
// Reacts to changes in the game state and updates the UI accordingly.

import useFetch from "../hooks/useFetch";
import { useGame } from "../context/GameContext";
import { useEffect, useCallback, useRef } from "react";
import Menu from "./menu"; 
import "./css/StoryScreen.css";
import "./css/Menu.css";

export default function StoryScreen() {
  const {
    playerName,
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
    resetGame,
    newGame,
  } = useGame();

  const { data: story, loading } = useFetch("/story.json");
  const currentAudioRef = useRef(null); // store currently playing audio

  useEffect(() => {
    console.log("=== StoryScreen Debug ===");
    console.log("Node:", node);
    console.log("HP:", hp);
    console.log("Inventory:", inventory);
    console.log("Progress:", progress);
    console.log("Visited:", visitedNodes);
    console.log("=========================");
  }, [hp, inventory, node, progress, visitedNodes]);

  // Node arrival effects + play node audio
  useEffect(() => {
    if (!story) return;
    const currentNode = story[node];
    if (!currentNode) return;

    // Stop previous node audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    // Node arrival logic
    if (!visitedNodes.includes(node)) {
      if (node.startsWith("badEnding")) setHp(0);

      if (currentNode.onArrive) {
        if (currentNode.onArrive.addItem) {
          setInventory((prev) =>
            prev.includes(currentNode.onArrive.addItem)
              ? prev
              : [...prev, currentNode.onArrive.addItem]
          );
        }
        if (currentNode.onArrive.takeDamage) {
          setHp((prev) => Math.max(0, prev - currentNode.onArrive.takeDamage));
        }
      }

      setVisitedNodes((prev) => [...prev, node]);
    }

    // Play node audio (works only if user interacted before)
    if (currentNode.playSound) {
      const audio = new Audio(currentNode.playSound);
      audio.volume = 0.5;
      audio.play().catch(() => {}); // ignore if blocked
      currentAudioRef.current = audio;
    }
  }, [node, story, setHp, setInventory, visitedNodes, setVisitedNodes]);

  // Handle player choices
  const handleChoice = useCallback(
    (choice) => {
      // Play hit/choice sound on user click
      if (choice.playSound) {
        const audio = new Audio(choice.playSound);
        audio.volume = 0.5;
        audio.play().catch(() => {});
      }

      if (choice.requires && !inventory.includes(choice.requires)) {
        alert(`You don't have ${choice.requires}!`);
        return;
      }

      if (choice.requires) {
        setInventory((prev) => {
          const newInv = [...prev];
          const index = newInv.indexOf(choice.requires);
          if (index > -1) newInv.splice(index, 1);
          return newInv;
        });
      }

      setProgress((prev) => [...prev, choice.to]);
      setNode(choice.to);
    },
    [inventory, setInventory, setNode, setProgress]
  );

  if (loading) return <p>Loading story...</p>;
  if (!story) return <p>Error loading story.</p>;

  const currentNode = story[node];
  const isDead = hp <= 0;
  const isVictory = node === "goodEnding";

  let visibleChoices = [];
  if (!isDead && !currentNode.isEnding) {
    visibleChoices = (currentNode.choices || []).filter((choice) => {
      if (choice.requires && !inventory.includes(choice.requires)) return false;

      const hasAltWithRequirement = (currentNode.choices || []).some(
        (alt) =>
          alt.requires &&
          inventory.includes(alt.requires) &&
          alt.to !== choice.to
      );

      if (!choice.requires && hasAltWithRequirement) return false;
      return true;
    });
  }

  return (
    <div
      className="story-screen-bg"
      style={{
        backgroundImage: currentNode.background
          ? `url(${currentNode.background})`
          : "none",
      }}
    >
      <div className={`story-screen ${isVictory ? "victory" : ""}`}>
        {/* Player stats */}
        <div className="player-stats">
          <div className="stat-row">
            <div className="stat-label">Player Name</div>
            <div className="stat-value">{playerName || "Unknown Adventurer"}</div>
          </div>

          <div className="stat-row">
            <div className="stat-label">Health</div>
            <div
              className={`stat-value ${
                isDead ? "hp-dead" : isVictory ? "hp-victory" : "hp-normal"
              }`}
            >
              {hp}
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-label">Inventory</div>
            <div className="stat-value">
              {inventory.length > 0 ? inventory.join(", ") : "None"}
            </div>
          </div>
        </div>

        {/* Story text */}
        <div className="story-text">
          <p>{currentNode.text}</p>
        </div>

        {/* Choices or Ending */}
        {currentNode.isEnding ? (
          <div className="ending-buttons">
            <button className="btn-play-again" onClick={resetGame}>
              Play Again
            </button>
            <button className="btn-new-game" onClick={newGame}>
              New Game
            </button>
          </div>
        ) : (
          <div className="choices">
            {isDead ? (
              <button
                className="btn-choice btn-dead"
                onClick={() => setNode("gameOver_hp")}
              >
                You have perished, you cannot continue any further.
              </button>
            ) : (
              visibleChoices.map((choice, idx) => (
                <button
                  key={idx}
                  className="btn-choice"
                  onClick={() => handleChoice(choice)}
                >
                  {choice.text}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Menu below the card */}
      {!currentNode.isEnding && <Menu />}
    </div>
  );
}