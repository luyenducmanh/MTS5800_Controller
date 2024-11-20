import { contextBridge, ipcRenderer } from "electron";

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld("measurementAPI", {
  startExample: () => {
    return ipcRenderer.invoke("start:example");
  },
});
