// ./src/App.jsx

import { useGame } from "./context/GameContext";
import StartScreen from "./components/StartScreen";
import StoryScreen from "./components/StoryScreen";
import NavBar from "./components/NavBar";
import useAmbience from "./hooks/useAmbience";
import "./App.css";

export default function App() {

    // Start ambience once for the whole app
  useAmbience();
  
  const { playerName } = useGame();

  return (
    <>
      {!playerName ? (
        <StartScreen />
      ) : (
        <>
          <NavBar />
          <StoryScreen />
        </>
      )}
    </>
  );
}
