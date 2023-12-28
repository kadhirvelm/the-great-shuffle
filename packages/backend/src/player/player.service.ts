import { Injectable } from "@nestjs/common";
import { ImageManipulationService } from "../helperServices/imageManipulation/imageManipulation.service";

@Injectable()
export class PlayerService {
  constructor(private readonly imageManipulation: ImageManipulationService) {}

  public fixSmackStudioImage() {
    return this.imageManipulation.fixSmackStudioImage();
  }

  public determineIdealSize() {
    return this.imageManipulation.determineIdealSize();
  }
}
