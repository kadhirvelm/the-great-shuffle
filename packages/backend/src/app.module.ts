import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { ImageManipulationService } from "./helperServices/imageManipulation/imageManipulation.service";
import { ChatGPTService } from "./helperServices/chatgpt/chatgpt.service";
import { GPTImageCleanUpService } from "./helperServices/imageManipulation/gptImageCleanUp.service";
import { RemoveBackgroundService } from "./helperServices/removeBackground/removeBackground.service";
import { MonstersModule } from "./monsters/monsters.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "assets"),
    }),
    MonstersModule,
  ],
  controllers: [AppController],
  providers: [
    ImageManipulationService,
    ChatGPTService,
    GPTImageCleanUpService,
    RemoveBackgroundService,
  ],
})
export class AppModule {}
