import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import * as sharp from "sharp";
import { PromptManager } from "./promptManager";

const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

@Injectable()
export class ChatGPTService {
  public async generatePower() {
    console.log(openAI);
  }

  public async generateMonster() {
    const monster = "vampire slime";
    const levels = ["1", "2", "3"] as const;

    const promises = Promise.all(
      levels.map(async (level) => {
        const { prompt, size } = PromptManager.monster(monster, level);

        const response = await openAI.images.generate({
          model: "dall-e-3",
          prompt,
          size,
          response_format: "b64_json",
          quality: "standard",
          n: 1,
        });

        const imageBase64 = response.data[0].b64_json;
        const imageBuffer = Buffer.from(imageBase64, "base64");

        sharp(imageBuffer).toFile(`./assets/visual/temp-monsters/${monster}-${level}.png`);

        return { level, name: monster };
      }),
    );

    return await promises;
  }
}
