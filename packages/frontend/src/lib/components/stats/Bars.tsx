import { useRegeneratePlayerStats } from "../../hooks/regeneratePlayerStats";
import { useTowerSelector } from "../../store/configureStore";
import { SinglePlayerStat } from "../../store/reducer/gameState";
import styles from "./Bars.module.scss";

interface StatBar extends SinglePlayerStat {
  label: string;
  color: string;
}

export const Bars = () => {
  useRegeneratePlayerStats();

  const { health, chi, stamina } = useTowerSelector((s) => s.gameState.player);

  const statBars: StatBar[] = [
    { ...health, label: "health", color: "remainingHealth" },
    { ...chi, label: "chi", color: "remainingChi" },
    { ...stamina, label: "stamina", color: "remainingStamina" },
  ];

  return (
    <div className={styles.playerStats}>
      <div className={styles.allBars}>
        {statBars.map((stat) => {
          const percentage = Math.round((stat.current / stat.max) * 100);
          return (
            <div className={styles.barContainer} key={stat.label}>
              <div className={styles.barBackground}>
                <div
                  className={styles[stat.color]}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
              <div className={styles.textContainer}>
                {stat.label} ({Math.floor(stat.current).toLocaleString()}/
                {Math.floor(stat.max).toLocaleString()})
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
