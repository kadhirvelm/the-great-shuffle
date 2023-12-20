import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameStage = "tutorial";

export interface PlayerStats {
  health: number;
  chi: number;
}

export interface GameState {
  stage: GameStage;
  player: PlayerStats;
}

const initialState: GameState = {
  stage: "tutorial",
  player: {
    health: 75,
    chi: 50,
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
      state.player.health += action.payload;
    },
    updateChi: (state, action: PayloadAction<number>) => {
      state.player.chi += action.payload;
    },
  },
});

export const { setStage, updateHealth, updateChi } = gameStateSlice.actions;

export const GameStateReducer = gameStateSlice.reducer;
