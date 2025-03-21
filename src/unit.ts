import { EventEmitter } from "events";
import debug from "debug";

import { ICRequest } from "./messages/request.js";
import { ICResponse } from "./messages/response.js";
import * as ws from "ws";
// needed for jsdoc
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as messages from "./messages/messages.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SubscribeToUpdates } from "./messages/notify.js";

const debugUnit = debug("ic:unit");

/**
 * Contains methods to connect to and communicate with an IntelliCenter controller.
 *
 * Call `connect` to connect to the unit.
 * Use `send` to send a message.
 * Subscribe to events to process socket conditions, notify updates, and message responses (if not `await`ing the response)
 *
 * Available events:
 *
 * * `"response-{messageID}"` - fired once per message sent with `send()` where {messageID} is the ID specified in the {@linkcode ICRequest} given to `send()`
 * * `"notify"` - fired when an update is available to a property previously subscribed to via a {@linkcode SubscribeToUpdates} request
 * * `"close"` - fired any time the client is closed by any means (timeout, by request, error, etc.)
 * * `"open"` - fired when the socket connects to the unit successfully
 * * `"error"` - fired when the socket encounters an unrecoverable error and will close
 * * `"timeout"` - fired when the socket has not received a ping response within the allowed threshold and will close
 * * `"connected"` - fired when a connection has completed successfully
 */
export class Unit extends EventEmitter {
  private client?: ws.WebSocket;
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

  /**
   * Connects to the specified unit and maintains a connection to it until `close()` is called.
   */
  public async connect() {
    if (this.client) {
      throw new Error("can't open a client that is already open");
    }

    debugUnit(`connecting to ws://${this.endpoint}:${this.port.toString()}`);

    this.client = new ws.WebSocket(
      `ws://${this.endpoint}:${this.port.toString()}`,
    );

    const { onOpen, onError, onClientMessage, socketCleanup } = this;
    this.client.on("error", onError);
    this.client.on("open", onOpen);
    this.client.on("close", socketCleanup);
    this.client.on("message", onClientMessage);

    this.pingTimer = setInterval(() => {
      debugUnit("sending ping");
      // this isn't an actual command that is recognized by the system, we just want to make sure they're still there.
      this.client?.send(JSON.stringify({ command: "ping" }));
    }, this.pingInterval);

    await new Promise((resolve, reject) => {
      this.client?.once("error", reject);
      this.client?.once("open", resolve);
    });

    debugUnit("connected");
    this.emit("connected");
  }

  private onOpen = () => {
    this.emit("open");
    this.heartbeat();
  };

  private onError = (evt: ws.ErrorEvent) => {
    // todo: auto reconnect?
    debugUnit("error in websocket: $o", evt);
    this.emit("error", evt);
    this.socketCleanup();
  };

  /**
   * Closes the connection to the unit.
   */
  public close() {
    if (!this.client) {
      return;
    }

    debugUnit("closing connection by request");
    this.client.close();
  }

  private socketCleanup = () => {
    debugUnit("socket cleanup");

    this.emit("close");
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
      this.emit("timeout");
      try {
        this.client?.close();
      } catch (ex) {
        debugUnit("exception trying to close client from ping timeout: %o", ex);
      }
      this.socketCleanup();
    }, this.pingInterval + 5000);
  };

  private onClientMessage = (msg: Buffer) => {
    debugUnit("message received, length %d", msg.length);
    this.heartbeat();

    const respObj = JSON.parse(msg.toString()) as ICResponse;
    if (respObj.command.toLowerCase() === "notifylist") {
      debugUnit("  it's a subscription confirmation or update");
      this.emit(`notify`, respObj);
    }

    this.emit(`response-${respObj.messageID}`, respObj);
  };

  /**
   * Sends a request to the unit.
   *
   * @param request an message from {@linkcode messages} to send to the unit.
   * @returns a promise that resolves into the {@linkcode ICResponse} with information about the request.
   */
  public async send(request: ICRequest): Promise<ICResponse> {
    if (!this.client) {
      return await new Promise(() => {
        throw new Error("client not connected");
      });
    }

    const payload = JSON.stringify(request);
    debugUnit(
      "sending message of length %d with id %s",
      payload.length,
      request.messageID,
    );

    this.client.send(payload);
    return await new Promise((resolve) => {
      this.once(`response-${request.messageID}`, (resp: ICResponse) => {
        debugUnit("  returning response to message %s", request.messageID);
        resolve(resp);
      });
    });
  }
}
