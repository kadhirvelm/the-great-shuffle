import { Injectable } from "@nestjs/common";
import { ChatGPTService } from "../helperServices/chatgpt/chatgpt.service";
import { Level, Weapon } from "../helperServices/chatgpt/promptManager";
import { GPTImageCleanUpService } from "../helperServices/imageManipulation/gptImageCleanUp.service";

@Injectable()
export class WeaponService {
  constructor(
    private chatGptService: ChatGPTService,
    private gptImageCleanUp: GPTImageCleanUpService,
  ) {}

  public generateWeapon() {
    const weaponType: Weapon = "shield";
    const weaponDescription: string = "fire inspired";
    const levels: Level[] = ["1", "2"];

    return this.chatGptService.generateWeapon(
      weaponType,
      weaponDescription,
      levels,
    );
  }

  public cleanUpWeapons() {
    const weaponType: Weapon = "rod";
    const weaponDescriptions: string[] = ["darkness", "sun god"];
    const levels: Level[] = ["1", "2", "3"];

    return this.gptImageCleanUp.removeBackgrounds(
      weaponDescriptions.flatMap((weaponDescription) =>
        levels.map(
          (level) => `temp-weapons/${weaponType}/${weaponDescription}-${level}`,
        ),
      ),
    );
  }

  public resizeWeapons() {
    const weaponType: Weapon = "sword";
    const weaponDescriptions: string[] = ["dragon steel", "iron"];
    const levels: Level[] = ["1", "2", "3"];

    return this.gptImageCleanUp.trimImage(
      weaponDescriptions.flatMap((weaponDescription) =>
        levels.map(
          (level) => `temp-weapons/${weaponType}/${weaponDescription}-${level}`,
        ),
      ),
      "center",
      { width: 175 },
    );
  }
}
