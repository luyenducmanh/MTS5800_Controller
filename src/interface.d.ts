export interface IMeasurementAPI {
  startExample: () => Promise<void>;
}

declare global {
  interface Window {
    measurementAPI: IMeasurementAPI;
  }
}
