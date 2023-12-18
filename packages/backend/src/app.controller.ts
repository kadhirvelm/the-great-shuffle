import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import {
  IBackendService,
  IService,
  RemoveString,
  backendService,
} from "@tower/api";

type IServiceImplementation<Service extends IService> = {
  [Key in keyof RemoveString<Service>]: (
    payload: Service[Key]["payload"],
  ) => Service[Key]["response"] | Promise<Service[Key]["response"]>;
};

@Controller()
export class AppController implements IServiceImplementation<IBackendService> {
  constructor(private readonly appService: AppService) {}

  @Get("health-check")
  healthCheck() {
    return { status: "ok" };
  }

  @Post(backendService.helloWorld.endpoint)
  helloWorld(@Body() _payload: IBackendService["helloWorld"]["payload"]) {
    return this.appService.helloWorld();
  }
}
