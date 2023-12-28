import { Injectable } from "@nestjs/common";
import { ChatGPTService } from "../helperServices/chatgpt/chatgpt.service";
import { GPTImageCleanUpService } from "../helperServices/imageManipulation/gptImageCleanUp.service";
import { Level } from "../helperServices/chatgpt/promptManager";

@Injectable()
export class MonstersService {
  constructor(
    private chatGptService: ChatGPTService,
    private gptImageCleanUp: GPTImageCleanUpService,
  ) {}

  public generateMonster() {
    const monster = "vampire slime";
    const levels: Level[] = ["1", "2", "3"];

    return this.chatGptService.generateMonster(monster, levels);
  }

  public cleanUpMonster() {
    const monster = "vampire slime";
    const levels: Level[] = ["1", "2", "3"];

    return this.gptImageCleanUp.removeBackgrounds(monster, levels);
  }

  public resizeMonster() {
    const monster = "vampire slime";
    const levels: Level[] = ["1", "2", "3"];

    return this.gptImageCleanUp.trimImage(monster, levels);
  }
}
