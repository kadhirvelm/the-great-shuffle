import { Controller, Get } from "@nestjs/common";
import { PlayerService } from "./player.service";

@Controller("player")
export class PlayerController {
  public constructor(private readonly playerService: PlayerService) {}

  @Get("fix-smack-studio")
  fixSmackStudioImage() {
    return this.playerService.fixSmackStudioImage();
  }

  @Get("get-ideal-size")
  determineIdealSize() {
    return this.playerService.determineIdealSize();
  }
}
