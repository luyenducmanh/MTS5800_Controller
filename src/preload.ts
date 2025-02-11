import { contextBridge, ipcRenderer } from "electron";
import { IMeasurementAPI } from "./interface";

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld("measurementAPI", {
  startExample: () => {
    return ipcRenderer.invoke("start:example");
  },
  executeCommand(cmd) {
    return ipcRenderer.invoke("execute:command", cmd);
  },
} as IMeasurementAPI);
