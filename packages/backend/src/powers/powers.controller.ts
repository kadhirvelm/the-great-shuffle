import { Controller, Get } from "@nestjs/common";
import { PowerService } from "./powers.service";

@Controller("powers")
export class PowersController {
  constructor(private readonly powersService: PowerService) {}

  @Get("generate")
  generatePowers() {
    return this.powersService.generatePower();
  }

  @Get("clean-up")
  cleanUpPower() {
    return this.powersService.cleanUpPower();
  }

  @Get("resize")
  resizePower() {
    return this.powersService.resizePower();
  }
}
