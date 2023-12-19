import { Store, configureStore } from "@reduxjs/toolkit";
import { GameStateReducer } from "./reducer/gameState";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";

export const towerStore = configureStore({
  reducer: {
    gameState: GameStateReducer,
  },
});

export type State = ReturnType<typeof towerStore.getState>;
export const useTowerSelector: TypedUseSelectorHook<State> = useSelector;

export type Dispatch = typeof towerStore.dispatch;
export const useTowerDispatch: () => Dispatch = useDispatch;

export const useTowerStore: () => Store<State> = useStore;
