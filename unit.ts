import { EventEmitter } from "events";
import { WebSocket } from "ws";
import { ICRequest } from "./messages/request.js";
import { ICResponse } from "./messages/response.js";
import { GetSystemInfoRequest } from "./messages/system-info.js";

export class Unit extends EventEmitter {
  private client?: WebSocket;
  private pingTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    public endpoint: string,
    public port = 6680,
  ) {
    super();

    this.endpoint = endpoint;
    this.port = port;
  }

  public async connect() {
    if (this.client) {
      throw new Error("can't open a client that is already open");
    }

    this.client = new WebSocket(
      `ws://${this.endpoint}:${this.port.toString()}`,
    );

    const { heartbeat, onClientMessage } = this;
    this.client.on("error", console.error);
    this.client.on("open", heartbeat);
    this.client.on("ping", heartbeat);
    this.client.on("close", () => {
      clearTimeout(this.pingTimeout);
      this.client?.removeAllListeners();
      this.client = undefined;
    });
    this.client.on("message", onClientMessage);

    await new Promise((resolve, reject) => {
      this.client?.once("error", reject);
      this.client?.once("open", resolve);
    });
  }

  public close() {
    this.client?.close();
  }

  private heartbeat = () => {
    clearTimeout(this.pingTimeout);

    this.pingTimeout = setTimeout(() => {
      this.close();
    }, 30000 + 1000);
  };

  private onClientMessage = (msg: Buffer) => {
    const respObj = JSON.parse(msg.toString()) as ICResponse;
    this.emit(`response-${respObj.messageID}`, respObj);
  };

  public async send(request: ICRequest): Promise<ICResponse> {
    this.client?.send(JSON.stringify(request));
    return await new Promise((resolve) => {
      this.once(`response-${request.messageID}`, (resp: ICResponse) => {
        resolve(resp);
      });
    });
  }

  public async getSystemInfo(): Promise<ICResponse> {
    const req = GetSystemInfoRequest();
    return await this.send(req);
  }
}
