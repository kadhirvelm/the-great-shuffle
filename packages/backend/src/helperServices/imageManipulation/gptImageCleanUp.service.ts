import { Injectable } from "@nestjs/common";
import { writeFileSync } from "fs";
import { renameSync, unlinkSync } from "fs-extra";
import * as sharp from "sharp";
import { RemoveBackgroundService } from "../removeBackground/removeBackground.service";

const TARGET_SIZE = 512;

@Injectable()
export class GPTImageCleanUpService {
  public constructor(
    private removeBackgroundService: RemoveBackgroundService,
  ) {}

  public async removeBackgrounds(fileNames: string[]) {
    const promises = await Promise.all(
      fileNames.map(async (fileName) => {
        const imageFile = `./assets/visual/${fileName}.png`;
        const imageBuffer =
          await this.removeBackgroundService.removeBackground(imageFile);

        writeFileSync(`./assets/visual/${fileName}.png`, imageBuffer);

        return { name: fileName };
      }),
    );

    return promises;
  }

  public async trimImage(fileNames: string[], position: string = "bottom") {
    const promises = await Promise.all(
      fileNames.map(async (fileName) => {
        const imageFile = `./assets/visual/${fileName}.png`;
        const outputFile = `./assets/visual/${fileName}-resize.png`;

        await sharp(imageFile)
          .trim()
          .resize(TARGET_SIZE, TARGET_SIZE, {
            fit: "contain",
            position,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .toFile(outputFile);

        unlinkSync(imageFile);
        renameSync(outputFile, imageFile);

        return { name: fileName };
      }),
    );

    return promises;
  }
}
