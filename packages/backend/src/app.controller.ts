import { Body, Controller, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { IBackendService, IService, RemoveString } from "@great-shuffle/api";

type IServiceImplementation<Service extends IService> = {
  [Key in keyof RemoveString<Service>]: (
    payload: Service[Key]["payload"],
  ) => Service[Key]["response"] | Promise<Service[Key]["response"]>;
};

@Controller()
export class AppController implements IServiceImplementation<IBackendService> {
  constructor(private readonly appService: AppService) {}

  @Post()
  helloWorld(@Body() _payload: IBackendService["helloWorld"]["payload"]) {
    return this.appService.helloWorld();
  }
}
