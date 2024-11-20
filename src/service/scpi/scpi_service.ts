import {
  APPLICATION_CMD,
  GENERAL_CMD,
  MEASURE_CMD,
  MODULE_CMD,
  SESSION_CMD,
} from "../../common/MTS5800_Common";
import ScpiClient from "./scpi_client";

export default class ScpiService {
  private readonly client: ScpiClient;
  private module_client: ScpiClient;
  private readonly host: string;

  constructor(host: string, port: number = 8000) {
    this.client = new ScpiClient(host, port);
    this.host = host;
  }

  public async connect(): Promise<void> {
    await this.client.connect();
  }

  async enableRemoteControl(): Promise<string> {
    return this.client.sendSafetyCommand(GENERAL_CMD.REM);
  }

  async getListModule(
    side: string = "BOTH",
    slice: string = "BASE"
  ): Promise<string[]> {
    const response = await this.client.sendSafetyCommand(
      `${GENERAL_CMD.GET_LIST_MODULE} ${side},${slice}`
    );
    return response?.split(",") ?? []; // Split the response into a list of functions
  }

  public async connectModule(modulePort: number): Promise<void> {
    this.module_client = new ScpiClient(this.host, modulePort);
    await this.module_client.connect();
  }

  async queryModulePort(
    moduleName: string,
    side: string = "BOTH",
    slice: string = "BASE"
  ): Promise<string> {
    return await this.module_client.sendCommand(
      `${MODULE_CMD.GET_PORT} ${side},${slice},"${moduleName}"`
    );
  }

  async checkModuleReady(
    moduleName: string,
    side: string = "BOTH",
    slice: string = "BASE"
  ): Promise<boolean> {
    const result = await this.module_client.sendSafetyCommand(
      `${MODULE_CMD.IS_READY} ${side},${slice},"${moduleName}"`
    );
    return result === "1";
  }

  async getApplicationList(): Promise<string[]> {
    const response = await this.module_client.sendSafetyCommand(
      `${APPLICATION_CMD.GET_LIST}`
    );
    return response?.split(",") ?? []; // Split response into a list of application names
  }

  async selectApplication(applicationName: string): Promise<void> {
    // Launch the application
    await this.module_client.sendSafetyCommand(
      `${SESSION_CMD.START} ${applicationName}`
    );

    const applicationId = await this.module_client.sendSafetyCommand(
      `${APPLICATION_CMD.GET_ID}`
    );
    console.log(`Launched Application ID: ${applicationId}`);

    // Select the application
    console.log(`Selecting application ID: ${applicationId}`);
    await this.module_client.sendSafetyCommand(
      `${APPLICATION_CMD.SELECT} ${applicationId}`
    );
  }

  async createAndStartSession(): Promise<void> {
    await this.module_client.sendCommand(SESSION_CMD.CREATE);
    await this.module_client.sendCommand(SESSION_CMD.START);
  }

  async endSession(): Promise<void> {
    await this.module_client.sendCommand(SESSION_CMD.END);
  }

  async startMeasurement(): Promise<string> {
    return this.module_client.sendCommand(MEASURE_CMD.INIT);
  }

  async stopMeasurement(): Promise<void> {
    await this.module_client.sendCommand(MEASURE_CMD.ABORT);
  }
}
