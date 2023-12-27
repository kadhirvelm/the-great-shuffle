import { AuraAttackGroup } from "../attacks/AuraAttackGroup";
import { RangedAttackGroup } from "../attacks/RangedAttackGroup";
import { RodAttackGroup } from "../attacks/RodAttackGroup";
import { ShieldGroup } from "../attacks/ShieldGroup";
import { SpearAttackGroup } from "../attacks/SpearAttackGroup";
import { SwordAttackGroup } from "../attacks/SwordAttackGroup";
import { Keyboard } from "../keyboard/Keyboard";
import { EnforcementGroup } from "../modifier/EnforcementGroup";

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
