import { Socket } from "net";

export default class ScpiClient {
  private readonly client: Socket; // Kết nối với máy đo
  private readonly host: string;
  private readonly port: number;

  constructor(host: string, port: number = 8000) {
    this.host = host;
    this.port = port;
    this.client = new Socket();
  }

  // Kết nối đến thiết bị
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.connect(this.port, this.host, () => {
        console.log(`Connected to ${this.host}:${this.port}`);
        resolve();
      });

      this.client.on("error", (err) => {
        console.error("Connection error:", err);
        reject(err);
      });

      this.client.on("close", () => {
        console.log("Connection closed");
      });
    });
  }

  // Gửi lệnh SCPI
  public sendCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.once("data", (data) => {
        resolve(data.toString().trim());
      });

      this.client.write(`${command}\n`, "utf-8", (err) => {
        if (err) {
          reject(err);
        }
      });
    });
  }

  private async checkSystemError(): Promise<void> {
    const response = await this.sendCommand("SYST:ERR?");
    const [code, message] = response.split(",");
    if (code !== "0") {
      throw new Error(`System error: ${message}`);
    }
  }

  public async sendSafetyCommand(command: string): Promise<string> {
    let result = await this.sendCommand(command);
    await this.checkSystemError();
    return result;
  }

  // Đóng kết nối
  disconnect(): void {
    this.client.end();
    console.log("Disconnected from SCPI server");
  }
}
