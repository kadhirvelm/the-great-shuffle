import {
  Action,
  Middleware,
  Store,
  ThunkDispatch,
  UnknownAction,
  configureStore,
} from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";
import { GameStateReducer } from "./reducer/gameState";

const logger: Middleware<
  {},
  unknown,
  ThunkDispatch<unknown, unknown, Action>
> = (store) => (next) => (action) => {
  const dispatchedOn = new Date();

  const previousState = store.getState();
  const result = next(action);
  const nextState = store.getState();

  console.groupCollapsed(
    `%c@redux - ${
      (action as UnknownAction).type
    } - ${dispatchedOn.toLocaleTimeString()}:${dispatchedOn.getMilliseconds()}`,
    "color: #c5c8ca",
  );
  console.log(`%c Previous state`, "color: #C0392B", previousState);
  console.log(`%c Action`, "color: #2980B9", action);
  console.log(`%c Next state`, "color: #27AE60", nextState);
  console.groupEnd();

  return result;
};

export const towerStore = configureStore({
  reducer: {
    gameState: GameStateReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type State = ReturnType<typeof towerStore.getState>;
export const useTowerSelector: TypedUseSelectorHook<State> = useSelector;

export type Dispatch = typeof towerStore.dispatch;
export const useTowerDispatch: () => Dispatch = useDispatch;

export const useTowerStore: () => Store<State> = useStore;
