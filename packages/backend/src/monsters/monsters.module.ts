import { Module } from "@nestjs/common";
import { MonstersController } from "./monsters.controller";
import { MonstersService } from "./monsters.service";
import { ChatGPTService } from "../helperServices/chatgpt/chatgpt.service";
import { GPTImageCleanUpService } from "../helperServices/imageManipulation/gptImageCleanUp.service";
import { RemoveBackgroundService } from "../helperServices/removeBackground/removeBackground.service";

@Module({
  controllers: [MonstersController],
  providers: [
    MonstersService,
    ChatGPTService,
    GPTImageCleanUpService,
    RemoveBackgroundService,
  ],
})
export class MonstersModule {}
