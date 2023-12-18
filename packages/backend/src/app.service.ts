import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { writeFileSync } from "fs";
import OpenAI from "openai";
import { resolve } from "path";

const openAi = (key: string) => new OpenAI({ apiKey: key });

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  helloWorld() {
    return { message: "Hello World!" };
  }

  async testSpeech() {
    const outputFile = resolve("./test.mp3");

    const instantiatedOpenAi = openAi(this.configService.get("OPEN_AI_KEY"));
    const mp3 = await instantiatedOpenAi.audio.speech.create({
      input:
        "Hello my name is the great shuffle. I'm excited to be your narrator.",
      model: "tts-1",
      voice: "alloy",
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    writeFileSync(outputFile, buffer);

    return { message: "Done" };
  }
}
