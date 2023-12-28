import { Controller, Get } from "@nestjs/common";
import { IBackendService, IService, RemoveString } from "@tower/api";
import { ImageManipulationService } from "./helperServices/imageManipulation/imageManipulation.service";

type IServiceImplementation<Service extends IService> = {
  [Key in keyof RemoveString<Service>]: (
    payload: Service[Key]["payload"],
  ) => Service[Key]["response"] | Promise<Service[Key]["response"]>;
};

@Controller()
export class AppController implements IServiceImplementation<IBackendService> {
  constructor(private readonly imageManipulation: ImageManipulationService) {}

  @Get("fix-smack-studio")
  fixSmackStudioImage() {
    return this.imageManipulation.fixSmackStudioImage();
  }

  @Get("get-ideal-size")
  determineIdealSize() {
    return this.imageManipulation.determineIdealSize();
  }
}
