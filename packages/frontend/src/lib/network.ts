import {
  IBackendService,
  IService,
  RemoveString,
  backendService,
} from "@tower/api";

type NetworkImplementation<Service extends IService> = {
  [Key in keyof RemoveString<Service>]: (
    payload: Service[Key]["payload"],
  ) => Promise<Service[Key]["response"]>;
};

export const networkCalls: NetworkImplementation<IBackendService> =
  Object.fromEntries(
    Object.entries(backendService).map(([endpoint, definition]) => {
      return [
        endpoint,
        async (payload: any) => {
          const response = await fetch(
            `http://localhost:8080/${definition.endpoint}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            },
          );

          return response.json();
        },
      ];
    }),
  ) as NetworkImplementation<IBackendService>;
