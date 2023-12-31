import { Injectable } from "@nestjs/common";
import { ChatGPTService } from "../helperServices/chatgpt/chatgpt.service";
import { GPTImageCleanUpService } from "../helperServices/imageManipulation/gptImageCleanUp.service";
import { Level, PowerType } from "../helperServices/chatgpt/promptManager";

@Injectable()
export class PowerService {
  constructor(
    private chatGptService: ChatGPTService,
    private gptImageCleanUp: GPTImageCleanUpService,
  ) {}

  public generatePower() {
    const element = "ice poison";
    const powerType: PowerType = "ranged";
    const levels: Level[] = ["1", "2", "3"];

    return this.chatGptService.generatePower(element, powerType, levels);
  }

  public cleanUpPower() {
    const element = "water";
    const powerTypes: PowerType[] = ["aura", "enforcement", "ranged"];
    const levels: Level[] = ["1", "2", "3"];

    return this.gptImageCleanUp.removeBackgrounds(
      powerTypes.flatMap((powerType) =>
        levels.map((level) => `temp-powers/${element}/${powerType}/${level}`),
      ),
    );
  }

  public resizePower() {
    const elements = ["fire", "lightning", "water"];
    const powerTypes: PowerType[] = ["aura", "enforcement", "ranged"];
    const levels: Level[] = ["1", "2", "3"];

    return this.gptImageCleanUp.trimImage(
      elements.flatMap(
        (element) =>
          powerTypes.flatMap((powerType) =>
            levels.map(
              (level) => `temp-powers/${element}/${powerType}/${level}`,
            ),
          ),
        "center",
      ),
    );
  }
}
