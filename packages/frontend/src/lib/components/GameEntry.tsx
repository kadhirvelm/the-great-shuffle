import { useEffect, useRef } from "react";
import { TutorialGame } from "../game/Game";
import styles from "./GameEntry.module.scss";

const GameEntry = () => {
  const gameCanvas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameCanvas.current == null) {
      return;
    }

    const tutorialGame = new TutorialGame(gameCanvas.current);
    return () => {
      tutorialGame.destroyGame();
    };
  }, [gameCanvas]);

  return <div className={styles.gameContainer} ref={gameCanvas} />;
};

export default GameEntry;
