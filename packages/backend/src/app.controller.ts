import { Controller, Get } from "@nestjs/common";
import { IBackendService, IService, RemoveString } from "@tower/api";
import { ImageManipulationService } from "./imageManipulation/imageManipulation.service";
import { ChatGPTService } from "./chatgpt/chatgpt.service";
import { GPTImageCleanUpService } from "./imageManipulation/gptImageCleanUp.service";

type IServiceImplementation<Service extends IService> = {
  [Key in keyof RemoveString<Service>]: (
    payload: Service[Key]["payload"],
  ) => Service[Key]["response"] | Promise<Service[Key]["response"]>;
};

@Controller()
export class AppController implements IServiceImplementation<IBackendService> {
  constructor(
    private readonly imageManipulation: ImageManipulationService,
    private chatGptService: ChatGPTService,
    private gptImageCleanUp: GPTImageCleanUpService,
  ) {}

  @Get("fix-smack-studio")
  fixSmackStudioImage() {
    return this.imageManipulation.fixSmackStudioImage();
  }

  @Get("get-ideal-size")
  determineIdealSize() {
    return this.imageManipulation.determineIdealSize();
  }

  @Get("generate-power")
  generatePower() {
    return this.chatGptService.generatePower();
  }

  @Get("generate-monster")
  generateMonster() {
    return this.chatGptService.generateMonster();
  }

  @Get("clean-up-monster")
  cleanUpMonster() {
    return this.gptImageCleanUp.removeBackgrounds();
  }

  @Get("resize-monster")
  resizeMonster() {
    return this.gptImageCleanUp.trimImage();
  }
}
