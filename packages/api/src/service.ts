export interface IService {
  [key: string]: {
    payload: any;
    response: any;
  };
}

export interface IBackendService extends IService {
  helloWorld: {
    payload: {};
    response: {
      message: string;
    };
  };
}
