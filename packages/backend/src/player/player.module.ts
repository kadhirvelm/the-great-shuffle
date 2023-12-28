import { Module } from "@nestjs/common";
import { PlayerController } from "./player.controller";
import { PlayerService } from "./player.service";
import { ImageManipulationService } from "../helperServices/imageManipulation/imageManipulation.service";

@Module({
  controllers: [PlayerController],
  providers: [PlayerService, ImageManipulationService],
})
export class PlayerModule {}
