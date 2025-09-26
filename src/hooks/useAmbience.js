// ./hooks/useAmbience.js
// used to import sound
import { useEffect } from "react";

let ambienceAudio; // singleton shared across the app
let hasStarted = false;

export default function useAmbience() {
  useEffect(() => {
    if (!ambienceAudio) {
      ambienceAudio = new Audio("/audios/forest-ambience.mp3"); // correct path
      ambienceAudio.loop = true;
      ambienceAudio.volume = 0; // start at 0 for fade-in
    }

    const fadeInAudio = (audio, targetVolume = 0.3, duration = 3000) => {
      let currentVolume = 0;
      const stepTime = 50; 
      const step = (targetVolume / duration) * stepTime;

      const interval = setInterval(() => {
        currentVolume = Math.min(currentVolume + step, targetVolume);
        audio.volume = currentVolume;
        if (currentVolume >= targetVolume) clearInterval(interval);
      }, stepTime);
    };

    const playAudio = () => {
      if (!hasStarted && ambienceAudio) {
        ambienceAudio
          .play()
          .then(() => {
            hasStarted = true;
            fadeInAudio(ambienceAudio, 0.3, 3000); // fade-in over 3s
          })
          .catch((err) => {
            console.warn(
              "Autoplay blocked. Will try to play on user interaction.",
              err
            );
            // Play on first user interaction
            const onUserInteract = () => {
              ambienceAudio.play().catch(() => {});
              fadeInAudio(ambienceAudio, 0.3, 3000);
              hasStarted = true;
              window.removeEventListener("click", onUserInteract);
              window.removeEventListener("keydown", onUserInteract);
            };
            window.addEventListener("click", onUserInteract);
            window.addEventListener("keydown", onUserInteract);
          });
      }
    };

    playAudio(); // attempt to play immediately on load
  }, []);
}
