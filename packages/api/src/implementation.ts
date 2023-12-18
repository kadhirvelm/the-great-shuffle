import { IBackendService } from "./service";

type IServiceImplementation<Service> = {
  [Key in keyof Service]: {
    endpoint: string;
  };
};

export const backendService: IServiceImplementation<IBackendService> = {
  helloWorld: {
    endpoint: "hello-world",
  },
};
