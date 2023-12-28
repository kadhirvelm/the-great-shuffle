import { Controller, Get } from "@nestjs/common";
import { WeaponService } from "./weapon.service";

@Controller("weapon")
export class WeaponController {
  constructor(private readonly weaponService: WeaponService) {}

  @Get("generate")
  generateWeapon() {
    return this.weaponService.generateWeapon();
  }

  @Get("clean-up")
  cleanUpWeapons() {
    return this.weaponService.cleanUpWeapons();
  }

  @Get("resize")
  resizeWeapons() {
    return this.weaponService.resizeWeapons();
  }
}
