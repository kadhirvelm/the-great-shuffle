import { useEffect, useRef } from "react";
import { TutorialGame } from "../game/Game";
import styles from "./GameEntry.module.scss";
import { useTowerStore } from "../store/configureStore";

const GameEntry = () => {
  const gameCanvas = useRef<HTMLDivElement>(null);
  const store = useTowerStore();

  useEffect(() => {
    if (gameCanvas.current == null) {
      return;
    }

    const tutorialGame = new TutorialGame(gameCanvas.current, store);
    return () => {
      tutorialGame.destroyGame();
    };
  }, [gameCanvas, store]);

  return <div className={styles.gameContainer} ref={gameCanvas} />;
};

export default GameEntry;
