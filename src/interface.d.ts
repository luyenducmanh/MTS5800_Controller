export interface IMeasurementAPI {
  startExample: () => Promise<void>;
  executeCommand: (cmd: string) => Promise<void>;
}

declare global {
  interface Window {
    measurementAPI: IMeasurementAPI;
  }
}
