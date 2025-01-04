import { EventEmitter } from "events";
import { WebSocket } from "ws";
import debug from "debug";

import { ICRequest } from "./messages/request.js";
import { ICResponse } from "./messages/response.js";

const debugUnit = debug("ic:unit");

export class Unit extends EventEmitter {
  private client?: WebSocket;
  private pingTimeout?: ReturnType<typeof setTimeout>;
  private pingTimer?: ReturnType<typeof setInterval>;
  private pingInterval = 60000;

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

    debugUnit(`connecting to ws://${this.endpoint}:${this.port.toString()}`);

    this.client = new WebSocket(
      `ws://${this.endpoint}:${this.port.toString()}`,
    );

    const { heartbeat, onClientMessage, socketCleanup } = this;
    this.client.on("error", (evt) => {
      // todo: emit event so we can reconnect? auto reconnect?
      debugUnit("error in websocket: $o", evt);
      socketCleanup();
    });
    this.client.on("open", heartbeat);
    this.client.on("ping", heartbeat);
    this.client.on("pong", heartbeat);
    this.client.on("close", socketCleanup);
    this.client.on("message", onClientMessage);

    this.pingTimer = setInterval(() => {
      debugUnit("sending ping");
      this.client?.ping();
    }, this.pingInterval);

    await new Promise((resolve, reject) => {
      this.client?.once("error", reject);
      this.client?.once("open", resolve);
    });

    debugUnit("connected");
  }

  public close() {
    debugUnit("closing connection by request");
    this.client?.close();
  }

  private socketCleanup = () => {
    debugUnit("socket cleanup");

    this.client?.removeAllListeners();
    this.client = undefined;

    if (this.pingTimeout) {
      clearTimeout(this.pingTimeout);
      this.pingTimeout = undefined;
    }

    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = undefined;
    }
  };

  private heartbeat = () => {
    debugUnit("received heartbeat");
    clearTimeout(this.pingTimeout);

    this.pingTimeout = setTimeout(() => {
      debugUnit("terminating connection due to heartbeat timeout");
      this.client?.terminate();
      this.socketCleanup();
    }, this.pingInterval + 5000);
  };

  private onClientMessage = (msg: Buffer) => {
    debugUnit("message received, length %d", msg.length);

    const respObj = JSON.parse(msg.toString()) as ICResponse;
    if (respObj.command.toLowerCase() === "notifylist") {
      debugUnit("  it's a subscription confirmation or update");
      this.emit(`notify`, respObj);
    }

    this.emit(`response-${respObj.messageID}`, respObj);
  };

  public async send(request: ICRequest): Promise<ICResponse> {
    const payload = JSON.stringify(request);
    debugUnit(
      "sending message of length %d with id %s",
      payload.length,
      request.messageID,
    );

    this.client?.send(payload);
    return await new Promise((resolve) => {
      this.once(`response-${request.messageID}`, (resp: ICResponse) => {
        debugUnit("  returning response to message %s", request.messageID);
        resolve(resp);
      });
    });
  }
}
