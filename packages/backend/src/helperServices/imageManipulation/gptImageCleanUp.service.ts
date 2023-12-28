import { Injectable } from "@nestjs/common";
import { writeFileSync } from "fs";
import { RemoveBackgroundService } from "../removeBackground/removeBackground.service";
import * as sharp from "sharp";
import { Level } from "../chatgpt/promptManager";

const TARGET_SIZE = 512;

@Injectable()
export class GPTImageCleanUpService {
  public constructor(
    private removeBackgroundService: RemoveBackgroundService,
  ) {}

  public async removeBackgrounds(monsterName: string, levels: Level[]) {
    const promises = await Promise.all(
      levels.map(async (level) => {
        const imageFile = `./assets/visual/temp-monsters/${monsterName}-${level}.png`;
        const imageBuffer =
          await this.removeBackgroundService.removeBackground(imageFile);

        writeFileSync(
          `./assets/visual/temp-monsters/${monsterName}-${level}.png`,
          imageBuffer,
        );

        return { name: `${monsterName}-${level}` };
      }),
    );

    return promises;
  }

  public async trimImage(monsterName: string, levels: Level[]) {
    const promises = await Promise.all(
      levels.map(async (level) => {
        const imageFile = `./assets/visual/temp-monsters/${monsterName}-${level}.png`;
        const outputFile = `./assets/visual/temp-monsters/${monsterName}-${level}-resize.png`;
        sharp(imageFile)
          .trim()
          .resize(TARGET_SIZE, TARGET_SIZE, {
            fit: "contain",
            position: "bottom",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .toFile(outputFile);

        return { name: `${monsterName}-${level}` };
      }),
    );

    return promises;
  }
}
