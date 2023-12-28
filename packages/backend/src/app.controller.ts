import { Controller } from "@nestjs/common";
import { IBackendService, IService, RemoveString } from "@tower/api";

type IServiceImplementation<Service extends IService> = {
  [Key in keyof RemoveString<Service>]: (
    payload: Service[Key]["payload"],
  ) => Service[Key]["response"] | Promise<Service[Key]["response"]>;
};

@Controller()
export class AppController implements IServiceImplementation<IBackendService> {}
