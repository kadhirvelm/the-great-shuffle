import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlayerChiPower, PlayerWeapon } from "@tower/api";
import { Movement } from "../../game/constants/enums";
import { TUTORIAL_SCENE_KEY } from "../../game/scenes/TutorialScene";
import { TOWER_SCENE_KEY } from "../../game/scenes/TowerScene";

export type GameStage = typeof TUTORIAL_SCENE_KEY | typeof TOWER_SCENE_KEY;

export interface SinglePlayerStat {
  current: number;
  max: number;
}

export interface PlayerStats {
  health: SinglePlayerStat;
  chi: SinglePlayerStat;
  stamina: SinglePlayerStat;
}

export type WeaponSlotNumber = "weapon-slotA" | "weapon-slotB";

export type ChiPowerSlotNumber =
  | "chiPower-slotA"
  | "chiPower-slotB"
  | "chiPower-slotC";

export interface PlayerEquipment {
  weapons: [PlayerWeapon | undefined, PlayerWeapon | undefined];
}

export interface GameState {
  stage: GameStage;
  player: PlayerStats;
  playerEquipment: PlayerEquipment;
  playerChiPowers: [
    PlayerChiPower | undefined,
    PlayerChiPower | undefined,
    PlayerChiPower | undefined,
  ];
}

const initialState: GameState = {
  stage: "TowerScene",
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
        attributes: {
          damage: 10,
          pushBack: {
            duration: 0,
            velocity: 0,
          },
        },
        name: "Darkness",
        assetName: "darkness",
        level: "1",
        type: "rod",
      },
      {
        attributes: {
          damage: 10,
          pushBack: {
            duration: 0,
            velocity: 0,
          },
          range: 1000,
          velocity: Movement.player_projectile_x,
        },
        name: "Calm Winds",
        assetName: "calm winds",
        level: "1",
        type: "spear",
      },
    ],
  },
  playerChiPowers: [
    {
      attributes: {
        damage: 100,
        duration: 100,
        pushBack: {
          duration: 0,
          velocity: 0,
        },
        scale: 1.5,
      },
      name: "Water",
      chiElement: "water",
      level: "2",
      type: "aura",
    },
    {
      attributes: {
        damage: 10,
        pushBack: {
          duration: 0,
          velocity: 0,
        },
        range: 1000,
        velocity: Movement.player_projectile_x,
      },
      name: "Fire",
      chiElement: "fire",
      level: "3",
      type: "ranged",
    },
    {
      attributes: {
        duration: 10000,
        enforcement: {
          defensiveAttributes: {
            defense: 10,
            recovery: 10,
            speed: 50,
          },
          offensiveAttributes: {
            chiFocus: 25,
            efficiency: 50,
            weaponStrength: 25,
          },
        },
      },
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
        weapon: PlayerWeapon | undefined;
        slotNumber: WeaponSlotNumber;
      }>,
    ) => {
      state.playerEquipment.weapons[Number(action.payload.slotNumber) - 1] =
        action.payload.weapon;
    },
    updateChiPower: (
      state,
      action: PayloadAction<{
        chiPower: PlayerChiPower | undefined;
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
    updateGameStage: (state, action: PayloadAction<GameStage>) => {
      state.stage = action.payload;
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
  updateGameStage,
  updateChiPower,
} = gameStateSlice.actions;

export const GameStateReducer = gameStateSlice.reducer;
