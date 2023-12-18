import { IService } from "./service";

export type RemoveString<Service extends IService> = {
  [Key in keyof Service as string extends Key ? never : Key]: any;
};
