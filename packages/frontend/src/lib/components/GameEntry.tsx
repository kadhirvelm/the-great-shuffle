import { useEffect, useRef } from "react";
import { PrimaryGame } from "../game/PrimaryGame";
import { useTowerStore } from "../store/configureStore";
import styles from "./GameEntry.module.scss";
import { Bars } from "./stats/Bars";

// @refresh reset

const GameEntry = () => {
  const gameCanvas = useRef<HTMLDivElement>(null);
  const store = useTowerStore();

  useEffect(() => {
    if (
      gameCanvas.current == null ||
      gameCanvas.current?.clientWidth !== window.innerWidth
    ) {
      return;
    }

    const primaryGame = new PrimaryGame(gameCanvas.current, store);
    return () => {
      primaryGame.destroyGame();
    };
  }, [gameCanvas, store, gameCanvas.current?.clientWidth]);

  return (
    <div className={styles.rootContainer}>
      <Bars />
      <div className={styles.gameContainer} ref={gameCanvas} />
    </div>
  );
};

export default GameEntry;
