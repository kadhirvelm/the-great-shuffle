import { PushBack } from "./generics";

export type WeaponType = "sword" | "spear" | "rod" | "shield";

export type WeaponLevel = "1" | "2" | "3";

export interface BaseWeaponType {
  name: string;
  assetName: string;
  level: WeaponLevel;
  type: WeaponType;
}

export const isSword = (weaponType: PlayerWeapon): weaponType is Sword => {
  return weaponType.type === "sword";
};

export const isSpear = (weaponType: PlayerWeapon): weaponType is Spear => {
  return weaponType.type === "spear";
};

export const isRod = (weaponType: PlayerWeapon): weaponType is Rod => {
  return weaponType.type === "rod";
};

export const isShield = (weaponType: PlayerWeapon): weaponType is Shield => {
  return weaponType.type === "shield";
};

export interface SwordAttackAttributes {
  damage: number;
  pushBack: PushBack;
}

export interface Sword extends BaseWeaponType {
  attributes: SwordAttackAttributes;
  type: "sword";
}

export interface SpearAttackAttributes {
  damage: number;
  range: number;
  velocity: number;
  pushBack: PushBack;
}

export interface Spear extends BaseWeaponType {
  attributes: SpearAttackAttributes;
  type: "spear";
}

export interface RodAttackAttributes {
  damage: number;
  pushBack: PushBack;
}

export interface Rod extends BaseWeaponType {
  attributes: RodAttackAttributes;
  type: "rod";
}

export interface ShieldAttributes {
  duration: number;
  direction: "left" | "right";
  pushBack: PushBack;
  scale: number;
}

export interface Shield extends BaseWeaponType {
  attributes: ShieldAttributes;
  type: "shield";
}

export type PlayerWeapon = Sword | Spear | Rod | Shield;
