import { set } from "@dotenvx/dotenvx";
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
    console.log(command);
    return new Promise((resolve, reject) => {
      let timeOut = setTimeout(() => {
        console.error("Command timeout");
        this.client.removeAllListeners("data");
        timeOut = null;
        resolve("Timeout");
      }, 90 * 1000);

      this.client.write(`${command.trim()}\n`, "ascii", (err) => {
        if (err) {
          console.error("Error sending command:", err);
          reject(err);
        }
      });

      this.client.write(`:SYSTem:ERRor?\n`, "ascii", (err) => {
        if (err) {
          console.error("Error sending command:", err);
          reject(err);
        }

        console.log(`Send command: :SYSTem:ERRor?`);
      });

      this.client.once("data", (data) => {
        console.log("Data response: ", data.toString("ascii"));
        if (timeOut) {
          clearTimeout(timeOut);
        }
        resolve(data.toString().trim());
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
    console.log(`Send safety command: ${command}`);
    let result = await this.sendCommand(command);
    console.log(`Response: ${result}`);
    await this.checkSystemError();
    return result;
  }

  // Đóng kết nối
  disconnect(): void {
    this.client.end();
    console.log("Disconnected from SCPI server");
  }
}
