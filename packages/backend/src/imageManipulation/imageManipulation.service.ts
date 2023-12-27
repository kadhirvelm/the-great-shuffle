import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import * as sharp from "sharp";
import * as _ from "lodash";

const ORIGINAL_WIDTH = 256;

const INPUT_NAME = "running";

const LEFT = 20;
const TOP = 0;
const WIDTH = 195;

const FRAME_NUMBER = 10;

@Injectable()
export class ImageManipulationService {
  public async fixSmackStudioImage() {
    const imageFile = readFileSync(`./src/imageManipulation/${INPUT_NAME}.png`);

    const originalImage = sharp(imageFile);

    const { width } = await originalImage.metadata();
    const totalFrames = width / ORIGINAL_WIDTH;

    const outputImage = sharp({
      create: {
        height: ORIGINAL_WIDTH - TOP,
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
        height: ORIGINAL_WIDTH - TOP,
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
        `./src/imageManipulation/${INPUT_NAME}-${WIDTH}x${
          ORIGINAL_WIDTH - TOP
        }-${LEFT}.fixed.png`,
      );

    return { width: WIDTH, height: ORIGINAL_WIDTH - TOP };
  }

  public async determineIdealSize() {
    const imageFile = readFileSync(`./src/imageManipulation/${INPUT_NAME}.png`);

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
        height: ORIGINAL_WIDTH - TOP,
        width: WIDTH,
      });

    frame.toFile(`./src/imageManipulation/${INPUT_NAME}.trimmed.png`);

    return { LEFT, TOP, WIDTH };
  }
}
