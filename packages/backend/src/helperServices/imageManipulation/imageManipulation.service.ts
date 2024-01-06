import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import * as sharp from "sharp";
import * as _ from "lodash";

const ORIGINAL_WIDTH = 192;

const INPUT_NAME = "wall_slide";

const LEFT = 40;
const TOP = 40;
const BOTTOM = 5;
const WIDTH = 83;

const FRAME_NUMBER = 2;

@Injectable()
export class ImageManipulationService {
  public async fixSmackStudioImage() {
    const imageFile = readFileSync(
      `./src/helperServices/imageManipulation/${INPUT_NAME}.png`,
    );

    const originalImage = sharp(imageFile);

    const { width } = await originalImage.metadata();
    const totalFrames = width / ORIGINAL_WIDTH;

    const outputImage = sharp({
      create: {
        height: ORIGINAL_WIDTH - TOP - BOTTOM,
        width: WIDTH * totalFrames,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    const compositeFrames: sharp.OverlayOptions[] = [];

    for (const frameNumber in _.range(0, totalFrames)) {
      const frame = sharp(imageFile).extract({
        left: parseFloat(frameNumber) * ORIGINAL_WIDTH,
        top: 0,
        height: ORIGINAL_WIDTH,
        width: ORIGINAL_WIDTH,
      });

      frame.extract({
        left: LEFT,
        top: TOP,
        height: ORIGINAL_WIDTH - TOP - BOTTOM,
        width: WIDTH,
      });

      compositeFrames.push({
        input: await frame.toBuffer(),
        top: 0,
        left: parseFloat(frameNumber) * WIDTH,
      });
    }

    outputImage
      .composite(compositeFrames)
      .toFile(
        `./src/helperServices/imageManipulation/${INPUT_NAME}-${WIDTH}x${
          ORIGINAL_WIDTH - TOP - BOTTOM
        }-${LEFT}.fixed.png`,
      );

    return { width: WIDTH, height: ORIGINAL_WIDTH - TOP - BOTTOM };
  }

  public async determineIdealSize() {
    const imageFile = readFileSync(
      `./src/helperServices/imageManipulation/${INPUT_NAME}.png`,
    );

    const originalImage = sharp(imageFile);

    const frame = originalImage
      .extract({
        left: ORIGINAL_WIDTH * FRAME_NUMBER,
        top: 0,
        height: ORIGINAL_WIDTH,
        width: ORIGINAL_WIDTH,
      })
      .extract({
        left: LEFT,
        top: TOP,
        height: ORIGINAL_WIDTH - TOP - BOTTOM,
        width: WIDTH,
      });

    frame.toFile(
      `./src/helperServices/imageManipulation/${INPUT_NAME}.trimmed.png`,
    );

    return { LEFT, TOP, BOTTOM, WIDTH };
  }
}
