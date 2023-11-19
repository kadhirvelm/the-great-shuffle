export interface IService {
  [key: string]: {
    payload: any;
    response: any;
  };
}

export type RemoveString<Service extends IService> = {
  [Key in keyof Service as string extends Key ? never : Key]: any;
};

type IServiceImplementation<Service> = {
  [Key in keyof Service]: {
    endpoint: string;
  };
};

export interface IBackendService extends IService {
  helloWorld: {
    payload: {};
    response: {
      message: string;
    };
  };
}

export const backendService: IServiceImplementation<IBackendService> = {
  helloWorld: {
    endpoint: "hello-world",
  },
};
