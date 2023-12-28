import { Module } from "@nestjs/common";
import { ChatGPTService } from "../helperServices/chatgpt/chatgpt.service";
import { GPTImageCleanUpService } from "../helperServices/imageManipulation/gptImageCleanUp.service";
import { RemoveBackgroundService } from "../helperServices/removeBackground/removeBackground.service";
import { WeaponController } from "./weapon.controller";
import { WeaponService } from "./weapon.service";

@Module({
  controllers: [WeaponController],
  providers: [
    WeaponService,
    ChatGPTService,
    GPTImageCleanUpService,
    RemoveBackgroundService,
  ],
})
export class WeaponModule {}
