import { useEffect, useRef } from "react";
import { PrimaryGame } from "../game/PrimaryGame";
import { useTowerStore } from "../store/configureStore";
import styles from "./GameEntry.module.scss";
import { Bars } from "./stats/Bars";
import { Weapons } from "./equipment/Weapons";
import { ChiPowers } from "./powers/ChiPowers";

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

  // Create a UI to look at the current equipment and select different things
  // Changing equipment dispatches redux actions changing the thing in the slot
  // We'll need an endpoint to fetch the current catalog of equipment

  return (
    <div className={styles.rootContainer}>
      <Bars />
      <Weapons />
      <ChiPowers />
      <div className={styles.gameContainer} ref={gameCanvas} />
    </div>
  );
};

export default GameEntry;
