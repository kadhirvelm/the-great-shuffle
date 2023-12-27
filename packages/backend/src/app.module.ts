import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ImageManipulationService } from "./imageManipulation/imageManipulation.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "assets"),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ImageManipulationService],
})
export class AppModule {}
