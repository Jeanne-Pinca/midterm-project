// ./src/components/StartScreen.jsx

// handles the main logic for the start screen of the game that includes the intro and name input sections

import { useState } from "react";
import { useGame } from "../context/GameContext";
import "./css/StartScreen.css";

export default function StartScreen({ onStart }) {
  const { resetGame, setPlayerName } = useGame();
  const [step, setStep] = useState("intro"); // "intro" → "name"
  const [tempName, setTempName] = useState("");

  const handleNext = () => {
    if (step === "intro") {
      setStep("name");
    } else if (step === "name" && tempName.trim() !== "") {
      resetGame();
      setPlayerName(tempName.trim());
      localStorage.setItem("playerName", tempName.trim());
      onStart();
    }
  };

  return (
    <div className="start-screen">
      {step === "intro" && (
        <div className="intro-section">
          {/* Container for title, description, and button */}
          <div className="intro-container">
            <h1 className="title">Aswang Hunter</h1>
            <p className="description">
              In the shadowed corners of the Philippine countryside, tales of mysterious creatures and restless spirits have haunted villagers for generations. You are about to step into this world—a world where legends breathe, darkness stirs, and every choice could mean survival… or demise.  
              As an aspiring hunter of the supernatural, your wits, courage, and heart will be tested. Will you track the elusive aswangs that lurk in the night? Or will the shadows claim you before dawn breaks?  
              Prepare your tools, steady your resolve, and choose your path wisely; the forest whispers, and it is listening.  
              Are you ready to begin your hunt?
            </p>
            <button onClick={handleNext} className="btn primary">
              Begin the Hunt!
            </button>
          </div>
        </div>
      )}

      {/* entering name section*/}

      {step === "name" && (
        <div className="name-section">
          <h2 className="subtitle">Enter your name, dear hunter</h2>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="name-input"
            placeholder="Your name..."
          />
          <button
            onClick={handleNext}
            disabled={tempName.trim() === ""}
            className={`btn ${tempName.trim() ? "success" : "disabled"}`}
          >
            Begin Adventure
          </button>
        </div>
      )}
    </div>
  );
}
