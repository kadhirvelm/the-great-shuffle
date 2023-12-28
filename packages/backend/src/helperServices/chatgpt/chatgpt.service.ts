import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import * as sharp from "sharp";
import { Level, PowerType, Prompt, PromptManager } from "./promptManager";
import { ensureDirSync } from "fs-extra";
import { join } from "path";

const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

@Injectable()
export class ChatGPTService {
  public async generateMonster(monsterPrompt: string, levels: Level[]) {
    const promises = Promise.all(
      levels.map(async (level) => {
        const inputPrompt = PromptManager.monster(monsterPrompt, level);
        await this.generateImage(
          "monsters",
          `${monsterPrompt}-${level}`,
          inputPrompt,
        );
        return { level, name: monsterPrompt };
      }),
    );

    return await promises;
  }

  public async generatePower(
    element: string,
    powerType: PowerType,
    levels: Level[],
  ) {
    const promises = Promise.all(
      levels.map(async (level) => {
        const inputPrompt = PromptManager.power(element, powerType, level);
        await this.generateImage(
          `powers/${element}/${powerType}`,
          level,
          inputPrompt,
        );
        return { level, name: element, type: powerType };
      }),
    );

    return await promises;
  }

  private async generateImage(
    destination: string,
    fileName: string,
    inputPrompt: Prompt,
  ) {
    const { prompt } = inputPrompt;
    const response = await openAI.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      response_format: "b64_json",
      quality: "standard",
      n: 1,
    });

    const imageBase64 = response.data[0].b64_json;
    const imageBuffer = Buffer.from(imageBase64, "base64");

    const directory = `./assets/visual/temp-${destination}`;
    ensureDirSync(directory);
    sharp(imageBuffer).toFile(join(directory, `${fileName}.png`));
  }
}
