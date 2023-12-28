import { Controller, Get } from "@nestjs/common";
import { MonstersService } from "./monsters.service";

@Controller("monsters")
export class MonstersController {
  constructor(private readonly monstersService: MonstersService) {}

  @Get("generate")
  generateMonster() {
    return this.monstersService.generateMonster();
  }

  @Get("clean-up")
  cleanUpMonster() {
    return this.monstersService.cleanUpMonster();
  }

  @Get("resize")
  resizeMonster() {
    return this.monstersService.resizeMonster();
  }
}
