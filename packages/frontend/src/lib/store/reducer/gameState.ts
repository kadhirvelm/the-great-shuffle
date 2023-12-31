import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChiPower, PlayerWeaponType } from "@tower/api";
import { PlayerChiPower } from "./PlayerChiPower";

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

export interface WeaponSlot {
  name: string;
  assetName: string;
  type: PlayerWeaponType;
}

export type WeaponSlotNumber = "weapon-slotA" | "weapon-slotB";

export type ChiPowerSlotNumber =
  | "chiPower-slotA"
  | "chiPower-slotB"
  | "chiPower-slotC";

export interface PlayerEquipment {
  weapons: [WeaponSlot | undefined, WeaponSlot | undefined];
}

export interface GameState {
  stage: GameStage;
  player: PlayerStats;
  playerEquipment: PlayerEquipment;
  playerChiPowers: [
    PlayerChiPower<ChiPower> | undefined,
    PlayerChiPower<ChiPower> | undefined,
    PlayerChiPower<ChiPower> | undefined,
  ];
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
  playerEquipment: {
    weapons: [
      {
        name: "Darkness 1",
        assetName: "darkness-1",
        type: "rod",
      },
      {
        name: "Calm Winds 1",
        assetName: "calm winds-1",
        type: "spear",
      },
    ],
  },
  playerChiPowers: [
    {
      name: "Water",
      chiElement: "water",
      level: "2",
      type: "aura",
    },
    {
      name: "Fire",
      chiElement: "fire",
      level: "3",
      type: "ranged",
    },
    {
      name: "Lightning",
      chiElement: "lightning",
      level: "1",
      type: "enforcement",
    },
  ],
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
    updateWeapon: (
      state,
      action: PayloadAction<{
        weapon: WeaponSlot | undefined;
        slotNumber: WeaponSlotNumber;
      }>,
    ) => {
      state.playerEquipment.weapons[Number(action.payload.slotNumber) - 1] =
        action.payload.weapon;
    },
    updateChiPower: (
      state,
      action: PayloadAction<{
        chiPower: PlayerChiPower<ChiPower>;
        slotNumber: ChiPowerSlotNumber;
      }>,
    ) => {
      if (action.payload.slotNumber === "chiPower-slotA") {
        state.playerChiPowers[0] = action.payload.chiPower;
      }

      if (action.payload.slotNumber === "chiPower-slotB") {
        state.playerChiPowers[1] = action.payload.chiPower;
      }

      if (action.payload.slotNumber === "chiPower-slotC") {
        state.playerChiPowers[2] = action.payload.chiPower;
      }
    },
  },
});

export const {
  setStage,
  updateHealth,
  updateStamina,
  updateChi,
  updateMaximums,
  updateWeapon,
  updateChiPower,
} = gameStateSlice.actions;

export const GameStateReducer = gameStateSlice.reducer;
