import { useRegeneratePlayerStats } from "../hooks/regeneratePlayerStats";
import { useTowerSelector } from "../store/configureStore";
import styles from "./PlayerStats.module.scss";

export const PlayerStats = () => {
  useRegeneratePlayerStats();

  const { health, chi } = useTowerSelector((s) => s.gameState.player);

  return (
    <div className={styles.playerStats}>
      <div className={styles.allBars}>
        <div className={styles.barContainer}>
          <div className={styles.textContainer}>Health ({health}/100)</div>
          <div className={styles.barBackground}>
            <div
              className={styles.remainingHealth}
              style={{ width: `${health}%` }}
            />
          </div>
        </div>
        <div className={styles.barContainer}>
          <div className={styles.textContainer}>Chi ({chi}/100)</div>
          <div className={styles.barBackground}>
            <div className={styles.remainingChi} style={{ width: `${chi}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
