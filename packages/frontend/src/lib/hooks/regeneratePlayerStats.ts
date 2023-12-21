import { useCallback, useEffect, useRef } from "react";
import { useTowerDispatch, useTowerSelector } from "../store/configureStore";
import { updateChi, updateHealth } from "../store/reducer/gameState";

const REGENERATION_INTERVAL = 1000;

export function useRegeneratePlayerStats() {
  const dispatch = useTowerDispatch();
  const { health, chi } = useTowerSelector((s) => s.gameState.player);

  const existingPid = useRef<NodeJS.Timeout | undefined>(undefined);

  const regenerateHealth = useCallback(() => {
    if (health === 100) {
      return;
    }

    dispatch(updateHealth(2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [health === 100]);

  const regenerateChi = useCallback(() => {
    if (chi === 100) {
      return;
    }

    dispatch(updateChi(2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chi === 100]);

  useEffect(() => {
    if (existingPid.current !== undefined) {
      clearTimeout(existingPid.current);
    }

    existingPid.current = setInterval(() => {
      regenerateHealth();

      regenerateChi();
    }, REGENERATION_INTERVAL);

    return () => {
      clearTimeout(existingPid.current);
    };
  }, [regenerateHealth, regenerateChi]);
}
