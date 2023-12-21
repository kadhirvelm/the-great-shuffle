import { Store } from "@reduxjs/toolkit";
import { State } from "../../store/configureStore";

let store: Store<State> | undefined;

export const getStore = () => {
  if (store === undefined) {
    throw Error("Attempted to access the Redux store before initializing.");
  }

  return store;
};

export const removeStore = () => (store = undefined);
export const setStore = (setStore: Store<State>) => (store = setStore);
