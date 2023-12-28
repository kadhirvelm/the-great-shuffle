import { Injectable } from "@nestjs/common";
import { writeFileSync } from "fs";
import { renameSync, unlinkSync } from "fs-extra";
import * as sharp from "sharp";
import { RemoveBackgroundService } from "../removeBackground/removeBackground.service";

export const DEFAULT_TARGET_SIZE = 512;
export const CUT_TARGET_SIZE = 175;
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

  public async trimImage(
    fileNames: string[],
    position: string = "bottom",
    dimensions?: { height?: number; width?: number },
  ) {
    const promises = await Promise.all(
      fileNames.map(async (fileName) => {
        const imageFile = `./assets/visual/${fileName}.png`;
        const outputFile = `./assets/visual/${fileName}-resize.png`;

        await sharp(imageFile)
          .trim()
          .resize(
            dimensions?.width ?? DEFAULT_TARGET_SIZE,
            dimensions?.height ?? DEFAULT_TARGET_SIZE,
            {
              fit: "contain",
              position,
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
          )
          .toFile(outputFile);

        unlinkSync(imageFile);
        renameSync(outputFile, imageFile);

        return { name: fileName };
      }),
    );

    return promises;
  }
}
