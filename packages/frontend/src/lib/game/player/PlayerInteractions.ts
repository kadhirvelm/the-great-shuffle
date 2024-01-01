import { AuraAttackGroup } from "../chiPowers/AuraAttackGroup";
import { RangedAttackGroup } from "../chiPowers/RangedAttackGroup";
import { RodAttackGroup } from "../weaponAttacks/RodAttackGroup";
import { ShieldGroup } from "../weaponAttacks/ShieldAttackGroup";
import { SpearAttackGroup } from "../weaponAttacks/SpearAttackGroup";
import { SwordAttackGroup } from "../weaponAttacks/SwordAttackGroup";
import { Keyboard } from "../keyboard/Keyboard";
import { EnforcementGroup } from "../chiPowers/EnforcementGroup";

export interface PlayerInteractions {
  keyboard: Keyboard;

  rangedAttackGroup: RangedAttackGroup;
  auraAttackGroup: AuraAttackGroup;
  enforcementGroup: EnforcementGroup;

  swordAttackGroup: SwordAttackGroup;
  spearAttackGroup: SpearAttackGroup;
  rodAttackGroup: RodAttackGroup;

  shieldGroup: ShieldGroup;
}
