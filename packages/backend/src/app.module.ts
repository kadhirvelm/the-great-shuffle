import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { MonstersModule } from "./monsters/monsters.module";
import { PlayerModule } from "./player/player.module";
import { PowersModule } from "./powers/powers.module";
import { WeaponModule } from "./weapon/weapon.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "assets"),
    }),
    MonstersModule,
    PlayerModule,
    PowersModule,
    WeaponModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
