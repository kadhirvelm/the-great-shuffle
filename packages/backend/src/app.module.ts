import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { ImageManipulationService } from "./imageManipulation/imageManipulation.service";
import { ChatGPTService } from "./chatgpt/chatgpt.service";
import { GPTImageCleanUpService } from "./imageManipulation/gptImageCleanUp.service";
import { RemoveBackgroundService } from "./removeBackground/removeBackground.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "assets"),
    }),
  ],
  controllers: [AppController],
  providers: [ImageManipulationService, ChatGPTService, GPTImageCleanUpService, RemoveBackgroundService],
})
export class AppModule {}
