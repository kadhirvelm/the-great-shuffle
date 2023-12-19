import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameStage = "tutorial";

export interface GameState {
  stage: GameStage;
}

const initialState: GameState = {
  stage: "tutorial",
};

const gameStateSlice = createSlice({
  name: "gameState",
  initialState,
  reducers: {
    setStage(state, action: PayloadAction<GameStage>) {
      state.stage = action.payload;
    },
  },
});

export const { setStage } = gameStateSlice.actions;
export const GameStateReducer = gameStateSlice.reducer;
