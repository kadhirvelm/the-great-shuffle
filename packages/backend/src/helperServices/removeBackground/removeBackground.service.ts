import { Injectable } from "@nestjs/common";
import { createReadStream } from "fs";
import { basename } from "path";
import * as FormData from "form-data";
import axios from "axios";

@Injectable()
export class RemoveBackgroundService {
  public removeBackground(pathToImage: string) {
    return new Promise<string>(async (resolve) => {
      const formData = new FormData();
      formData.append("size", "auto");
      formData.append(
        "image_file",
        createReadStream(pathToImage),
        basename(pathToImage),
      );

      try {
        const response = await axios("https://api.remove.bg/v1.0/removebg", {
          method: "post",
          data: formData,
          responseType: "arraybuffer",
          headers: {
            ...formData.getHeaders(),
            "X-Api-Key": process.env.REMOVE_BG_KEY,
          },
        });
        resolve(response.data);
      } catch (error) {
        console.error(error);
      }
    });
  }
}
