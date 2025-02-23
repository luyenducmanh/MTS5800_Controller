import { app, BrowserWindow, ipcMain } from "electron";
import dotenvx from "@dotenvx/dotenvx";
import ScpiService from "./service/scpi/scpi_service";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Load environment variables from .env file
dotenvx.config();
const isDebug = process.env.NODE_ENV === "development";
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const host = process.env.REMOTE_IP ?? "";
const port = process.env.REMOTE_PORT ? Number(process.env.REMOTE_PORT) : 8000;
let service: ScpiService | null = null;

async function testMeasure() {
  service = new ScpiService(host, port);
  // let result = "unavailable";
  try {
    await service.connect();

    // Enable Remote Control
    await service.enableRemoteControl();
    await service.enableUIControl();

    // // Query module port
    // const port = await service.queryModulePort("BERT");
    // console.log("Module Port:", port);

    // // Check if module is ready
    // const isReady = await service.checkModuleReady("BERT");
    // console.log("Module Ready:", isReady);

    // if (isReady) {
    //   // Launch an application
    //   await service.selectApplication("TermEth1GL2Traffic");

    //   // Create and start session
    //   await service.createAndStartSession();

    //   // Start the test
    //   result = await service.startMeasurement();

    //   // Stop the test (example)
    //   await service.stopMeasurement();
    // }
  } catch (error) {
    console.error("Error in remote control:", error);
  }

  return true;
}

async function testCommand(cmd: string) {
  return service.testCommand(cmd);
}

const createWindow = async (): Promise<void> => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  ipcMain.handle("start:example", async () => {
    console.log("Start Example");
    return await testMeasure();
  });

  ipcMain.handle("execute:command", async (event, cmd: string) => {
    return await testCommand(cmd);
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
