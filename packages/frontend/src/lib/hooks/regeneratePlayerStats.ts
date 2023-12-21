import { useCallback, useEffect, useRef } from "react";
import { useTowerDispatch, useTowerSelector } from "../store/configureStore";
import {
  updateChi,
  updateHealth,
  updateStamina,
} from "../store/reducer/gameState";

const REGENERATION_INTERVAL = 1000;

export function useRegeneratePlayerStats() {
  const dispatch = useTowerDispatch();
  const { health, chi, stamina } = useTowerSelector((s) => s.gameState.player);

  const existingPid = useRef<NodeJS.Timeout | undefined>(undefined);

  const regenerateHealth = useCallback(() => {
    if (health.current === health.max) {
      return;
    }

    dispatch(updateHealth(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [health.current === health.max]);

  const regenerateChi = useCallback(() => {
    if (chi.current === 100) {
      return;
    }

    dispatch(updateChi(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chi.current === chi.max]);

  const regenerateStamina = useCallback(() => {
    if (stamina.current === 100) {
      return;
    }

    dispatch(updateStamina(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chi.current === chi.max]);

  useEffect(() => {
    if (existingPid.current !== undefined) {
      clearTimeout(existingPid.current);
    }

    existingPid.current = setInterval(() => {
      regenerateHealth();
      regenerateChi();
      regenerateStamina();
    }, REGENERATION_INTERVAL);

    return () => {
      clearTimeout(existingPid.current);
    };
  }, [regenerateHealth, regenerateChi]);
}
