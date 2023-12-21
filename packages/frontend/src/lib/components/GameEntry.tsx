import { useEffect, useRef } from "react";
import { PrimaryGame } from "../game/PrimaryGame";
import styles from "./GameEntry.module.scss";
import { useTowerStore } from "../store/configureStore";
import { Bars } from "./stats/Bars";

// @refresh reset

const GameEntry = () => {
  const gameCanvas = useRef<HTMLDivElement>(null);
  const store = useTowerStore();

  useEffect(() => {
    if (gameCanvas.current == null) {
      return;
    }

    const primaryGame = new PrimaryGame(gameCanvas.current, store);
    return () => {
      primaryGame.destroyGame();
    };
  }, [gameCanvas, store]);

  return (
    <div className={styles.rootContainer}>
      <div className={styles.statsContainer}>
        <Bars />
      </div>
      <div className={styles.gameContainer} ref={gameCanvas} />
    </div>
  );
};

export default GameEntry;
