import { Injectable } from "@nestjs/common";
import { writeFileSync } from "fs";
import { RemoveBackgroundService } from "../removeBackground/removeBackground.service";
import * as sharp from "sharp";

const TARGET_SIZE = 512;

@Injectable()
export class GPTImageCleanUpService {
  public constructor(private removeBackgroundService: RemoveBackgroundService) {}

  public async removeBackgrounds() {
    const levels = ["1", "2", "3"];

    const monster = "";

    if (monster === "") {
      return { name: "no monster" }
    }

    const promises = await Promise.all(levels.map(async (level) => {
      const imageFile = `./assets/visual/temp-monsters/${monster}-${level}.png`;
      const imageBuffer = await this.removeBackgroundService.removeBackground(imageFile);

      writeFileSync(`./assets/visual/temp-monsters/${monster}-${level}.png`, imageBuffer);

      return { name: `${monster}-${level}` }
    }));

    return promises;
  }

  public async trimImage() {
    const levels = ["1", "2", "3"];

    const monsters = ["vampire slime"];

    const promises = await Promise.all(monsters.flatMap((monster) => {
      return levels.map(async (level) => {
      const imageFile = `./assets/visual/temp-monsters/${monster}-${level}.png`;
      const outputFile = `./assets/visual/temp-monsters/${monster}-${level}-resize.png`;
      sharp(imageFile).trim().resize(TARGET_SIZE, TARGET_SIZE, { fit: "contain", position: "bottom", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(outputFile);

      return { name: `${monster}-${level}` }
    })}));

    return promises;
  }
}
