import { Module } from "@nestjs/common";
import { PowersController } from "./powers.controller";
import { PowerService } from "./powers.service";
import { ChatGPTService } from "../helperServices/chatgpt/chatgpt.service";
import { GPTImageCleanUpService } from "../helperServices/imageManipulation/gptImageCleanUp.service";
import { RemoveBackgroundService } from "../helperServices/removeBackground/removeBackground.service";

@Module({
  controllers: [PowersController],
  providers: [
    PowerService,
    ChatGPTService,
    GPTImageCleanUpService,
    RemoveBackgroundService,
  ],
})
export class PowersModule {}
