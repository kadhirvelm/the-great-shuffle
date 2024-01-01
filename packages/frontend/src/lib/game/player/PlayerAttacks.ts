import { Store } from "@reduxjs/toolkit";
import { State } from "../../store/configureStore";
import {
  ChiPowerSlotNumber,
  WeaponSlotNumber,
} from "../../store/reducer/gameState";
import { AuraAttack } from "../chiPowers/AuraAttack";
import { RangedAttack } from "../chiPowers/RangedAttack";
import { RodAttack } from "../weaponAttacks/RodAttack";
import { SpearAttack } from "../weaponAttacks/SpearAttack";
import { SwordAttack } from "../weaponAttacks/SwordAttack";
import { Enforcement } from "../chiPowers/Enforcement";
import { getStore } from "../store/storeManager";
import { Player } from "./Player";
import {
  isRanged,
  isAura,
  isEnforcement,
  RangedChiPower,
  AuraChiPower,
  EnforcementChiPower,
  isRod,
  isSpear,
  isSword,
  isShield,
  Sword,
  Shield,
  Spear,
  Rod,
} from "@tower/api";
import { ShieldAttack } from "../weaponAttacks/ShieldAttack";

export class PlayerAttack {
  private reduxStore: Store<State>;

  public constructor(private playerSprite: Player) {
    this.reduxStore = getStore();
  }

  public handleKeyboardInput() {
    if (
      Phaser.Input.Keyboard.JustDown(
        this.playerSprite.playerInteractions.keyboard.chiPowerSlotA,
      )
    ) {
      this.fireChiPower("chiPower-slotA");
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.playerSprite.playerInteractions.keyboard.chiPowerSlotB,
      )
    ) {
      this.fireChiPower("chiPower-slotB");
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.playerSprite.playerInteractions.keyboard.chiPowerSlotC,
      )
    ) {
      this.fireChiPower("chiPower-slotC");
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.playerSprite.playerInteractions.keyboard.weaponSlotA,
      )
    ) {
      return this.fireWeapon("weapon-slotA");
    }

    if (
      Phaser.Input.Keyboard.JustDown(
        this.playerSprite.playerInteractions.keyboard.weaponSlotB,
      )
    ) {
      return this.fireWeapon("weapon-slotB");
    }
  }

  private fireChiPower(slotNumber: ChiPowerSlotNumber) {
    const allChiPowers = this.reduxStore.getState().gameState.playerChiPowers;
    const resolvedSlotNumber = (() => {
      if (slotNumber === "chiPower-slotA") {
        return 0;
      }

      if (slotNumber === "chiPower-slotB") {
        return 1;
      }

      if (slotNumber === "chiPower-slotC") {
        return 2;
      }

      throw new Error(`Unknown slot number: ${slotNumber}`);
    })();
    const firedChiSlot = allChiPowers[resolvedSlotNumber];
    if (firedChiSlot == null) {
      return;
    }

    if (isRanged(firedChiSlot)) {
      return this.fireRangedAttack(slotNumber, firedChiSlot);
    }

    if (isAura(firedChiSlot)) {
      return this.fireAuraAttack(slotNumber, firedChiSlot);
    }

    if (isEnforcement(firedChiSlot)) {
      return this.fireEnforcement(slotNumber, firedChiSlot);
    }

    throw new Error(`Unknown chi power type ${firedChiSlot}`);
  }

  private fireRangedAttack(
    slotNumber: ChiPowerSlotNumber,
    _rangedChiPower: RangedChiPower,
  ) {
    if (!this.playerSprite.playerStatsHandler.rangedAttack.canFire()) {
      this.playerSprite.noChi();
      return;
    }

    const maybeRangedAttack: RangedAttack | null =
      this.playerSprite.playerInteractions.rangedAttackGroup.get(
        0,
        0,
        slotNumber,
      );
    if (maybeRangedAttack == null) {
      return;
    }

    maybeRangedAttack.fire(
      this.playerSprite.x,
      this.playerSprite.y,
      this.playerSprite.flipX ? "left" : "right",
      {
        damage: this.playerSprite.playerStatsHandler.rangedAttack.damage(),
        range: this.playerSprite.playerStatsHandler.rangedAttack.range(),
        velocity: this.playerSprite.playerStatsHandler.rangedAttack.velocity(),
        pushBack: {
          duration: 100,
          velocity: 10,
        },
      },
    );

    this.playerSprite.playerStatsHandler.rangedAttack.consumeChi();
  }

  private fireAuraAttack(
    slotNumber: ChiPowerSlotNumber,
    _auraChiPower: AuraChiPower,
  ) {
    if (!this.playerSprite.playerStatsHandler.auraAttack.canFire()) {
      this.playerSprite.noChi();
      return;
    }

    const maybeAuraAttack: AuraAttack | null =
      this.playerSprite.playerInteractions.auraAttackGroup.get(
        0,
        0,
        slotNumber,
      );
    if (maybeAuraAttack == null) {
      return;
    }

    maybeAuraAttack.fire(this.playerSprite.x, this.playerSprite.y, {
      damage: this.playerSprite.playerStatsHandler.auraAttack.damage(),
      duration: this.playerSprite.playerStatsHandler.auraAttack.duration(),
      scale: this.playerSprite.playerStatsHandler.auraAttack.scale(),
      pushBack: {
        duration: 0,
        velocity: 0,
      },
    });
    this.playerSprite.playerStatsHandler.auraAttack.consumeChi();
  }

  private fireEnforcement(
    slotNumber: ChiPowerSlotNumber,
    _enforcement: EnforcementChiPower,
  ) {
    if (!this.playerSprite.playerStatsHandler.enforcement.canFire()) {
      this.playerSprite.noChi();
      return;
    }

    const maybeEnforcement: Enforcement | null =
      this.playerSprite.playerInteractions.enforcementGroup.get(
        0,
        0,
        slotNumber,
      );
    if (maybeEnforcement == null) {
      return;
    }

    maybeEnforcement.fire(this.playerSprite, {
      duration: this.playerSprite.playerStatsHandler.enforcement.duration(),
      enforcement: {
        offensiveAttributes: {
          chiFocus: 5,
          efficiency: 5,
          weaponStrength: 5,
        },
      },
    });
    this.playerSprite.playerStatsHandler.auraAttack.consumeChi();
  }

  private fireWeapon(slotNumber: WeaponSlotNumber) {
    const allWeaponSlot =
      this.reduxStore.getState().gameState.playerEquipment.weapons;
    const firedWeaponSlot =
      allWeaponSlot[slotNumber === "weapon-slotA" ? 0 : 1];
    if (firedWeaponSlot == null) {
      return;
    }

    if (isSword(firedWeaponSlot)) {
      return this.fireSwordAttack(slotNumber, firedWeaponSlot);
    }

    if (isRod(firedWeaponSlot)) {
      return this.fireRodAttack(slotNumber, firedWeaponSlot);
    }

    if (isSpear(firedWeaponSlot)) {
      return this.fireSpearAttack(slotNumber, firedWeaponSlot);
    }

    if (isShield(firedWeaponSlot)) {
      return this.fireShield(slotNumber, firedWeaponSlot);
    }

    throw new Error(`Unknown weapon type ${firedWeaponSlot}`);
  }

  private fireSwordAttack(slotNumber: WeaponSlotNumber, _swordWeapon: Sword) {
    if (!this.playerSprite.playerStatsHandler.swordAttack.canFire()) {
      this.playerSprite.noStamina();
      return;
    }

    const maybeSwordAttack: SwordAttack | null =
      this.playerSprite.playerInteractions.swordAttackGroup.get(
        0,
        0,
        slotNumber,
      );
    if (maybeSwordAttack == null) {
      return;
    }

    maybeSwordAttack.fire(
      this.playerSprite,
      this.playerSprite.flipX ? "left" : "right",
      {
        damage: this.playerSprite.playerStatsHandler.swordAttack.damage(),
        pushBack: {
          duration: 0,
          velocity: 0,
        },
      },
    );
    this.playerSprite.playerStatsHandler.swordAttack.consumeStamina();
  }

  private fireSpearAttack(slotNumber: WeaponSlotNumber, _spearWeapon: Spear) {
    if (!this.playerSprite.playerStatsHandler.spearAttack.canFire()) {
      this.playerSprite.noStamina();
      return;
    }

    const maybeSpearAttack: SpearAttack | null =
      this.playerSprite.playerInteractions.spearAttackGroup.get(
        0,
        0,
        slotNumber,
      );
    if (maybeSpearAttack == null) {
      return;
    }

    maybeSpearAttack.fire(
      this.playerSprite.x,
      this.playerSprite.y,
      this.playerSprite.flipX ? "left" : "right",
      {
        damage: this.playerSprite.playerStatsHandler.spearAttack.damage(),
        range: this.playerSprite.playerStatsHandler.spearAttack.range(),
        velocity: this.playerSprite.playerStatsHandler.spearAttack.velocity(),
        pushBack: {
          duration: 100,
          velocity: 10,
        },
      },
    );
    this.playerSprite.playerStatsHandler.spearAttack.consumeStamina();
  }

  private fireRodAttack(slotNumber: WeaponSlotNumber, _rodAttack: Rod) {
    if (!this.playerSprite.playerStatsHandler.rodAttack.canFire()) {
      this.playerSprite.noStamina();
      return;
    }

    const maybeRodAttack: RodAttack | undefined =
      this.playerSprite.playerInteractions.rodAttackGroup.get(0, 0, slotNumber);
    if (maybeRodAttack == null) {
      return;
    }

    maybeRodAttack.fire(
      this.playerSprite,
      this.playerSprite.flipX ? "left" : "right",
      {
        damage: this.playerSprite.playerStatsHandler.rodAttack.damage(),
        pushBack: this.playerSprite.playerStatsHandler.rodAttack.pushBack(),
      },
    );
    this.playerSprite.playerStatsHandler.rodAttack.consumeStamina();
  }

  private fireShield(slotNumber: WeaponSlotNumber, _shield: Shield) {
    if (!this.playerSprite.playerStatsHandler.shield.canFire()) {
      this.playerSprite.noStamina();
      return;
    }

    const maybeShield: ShieldAttack | undefined =
      this.playerSprite.playerInteractions.shieldGroup.get(0, 0, slotNumber);
    if (maybeShield == null) {
      return;
    }

    maybeShield.fire(this.playerSprite.x, this.playerSprite.y, {
      duration: this.playerSprite.playerStatsHandler.shield.duration(),
      pushBack: this.playerSprite.playerStatsHandler.shield.pushBack(),
      direction: this.playerSprite.flipX ? "left" : "right",
      scale: this.playerSprite.playerStatsHandler.shield.scale(),
    });
    this.playerSprite.playerStatsHandler.shield.consumeStamina();
  }
}
