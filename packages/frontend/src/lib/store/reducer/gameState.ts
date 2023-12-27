import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameStage = "tutorial";

export interface SinglePlayerStat {
  current: number;
  max: number;
}

export interface PlayerStats {
  health: SinglePlayerStat;
  chi: SinglePlayerStat;
  stamina: SinglePlayerStat;
}
export interface GameState {
  stage: GameStage;
  player: PlayerStats;
}

const initialState: GameState = {
  stage: "tutorial",
  player: {
    health: {
      current: Infinity,
      max: 0,
    },
    chi: {
      current: Infinity,
      max: 0,
    },
    stamina: {
      current: Infinity,
      max: 0,
    },
  },
};

const gameStateSlice = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    setStage: (state, action: PayloadAction<GameStage>) => {
      state.stage = action.payload;
    },
    updateHealth: (state, action: PayloadAction<number>) => {
      state.player.health.current = Math.max(
        0,
        Math.min(
          state.player.health.current + action.payload,
          state.player.health.max,
        ),
      );
    },
    updateChi: (state, action: PayloadAction<number>) => {
      state.player.chi.current = Math.max(
        0,
        Math.min(
          state.player.chi.current + action.payload,
          state.player.chi.max,
        ),
      );
    },
    updateStamina: (state, action: PayloadAction<number>) => {
      state.player.stamina.current = Math.max(
        0,
        Math.min(
          state.player.stamina.current + action.payload,
          state.player.stamina.max,
        ),
      );
    },
    updateMaximums: (
      state,
      action: PayloadAction<{ health: number; chi: number; stamina: number }>,
    ) => {
      state.player.health.max = action.payload.health;
      state.player.chi.max = action.payload.chi;
      state.player.stamina.max = action.payload.stamina;

      state.player.health.current = Math.min(
        state.player.health.current,
        action.payload.health,
      );
      state.player.chi.current = Math.min(
        state.player.chi.current,
        action.payload.chi,
      );
      state.player.stamina.current = Math.min(
        state.player.stamina.current,
        action.payload.stamina,
      );
    },
  },
});

export const {
  setStage,
  updateHealth,
  updateStamina,
  updateChi,
  updateMaximums,
} = gameStateSlice.actions;

export const GameStateReducer = gameStateSlice.reducer;
