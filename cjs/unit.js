"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
const events_1 = require("events");
const debug_1 = __importDefault(require("debug"));
const debugUnit = (0, debug_1.default)("ic:unit");
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
class Unit extends events_1.EventEmitter {
    endpoint;
    port;
    client;
    pingTimeout;
    pingTimer;
    pingInterval = 60000;
    constructor(endpoint, port = 6680) {
        super();
        this.endpoint = endpoint;
        this.port = port;
        this.endpoint = endpoint;
        this.port = port;
    }
    /**
     * Connects to the specified unit and maintains a connection to it until `close()` is called.
     */
    async connect() {
        if (this.client) {
            throw new Error("can't open a client that is already open");
        }
        debugUnit(`connecting to ws://${this.endpoint}:${this.port.toString()}`);
        this.client = new WebSocket(`ws://${this.endpoint}:${this.port.toString()}`);
        const { onOpen, onError, onClientMessage, socketCleanup } = this;
        this.client.addEventListener("error", onError);
        this.client.addEventListener("open", onOpen);
        this.client.addEventListener("close", socketCleanup);
        this.client.addEventListener("message", onClientMessage);
        this.pingTimer = setInterval(() => {
            debugUnit("sending ping");
            // this isn't an actual command that is recognized by the system, we just want to make sure they're still there.
            this.client?.send(JSON.stringify({ command: "ping" }));
        }, this.pingInterval);
        await new Promise((resolve, reject) => {
            this.client?.addEventListener("error", reject, true);
            this.client?.addEventListener("open", resolve, true);
        });
        debugUnit("connected");
        this.emit("connected");
    }
    onOpen = () => {
        this.emit("open");
        this.heartbeat();
    };
    onError = (evt) => {
        // todo: emit event so we can reconnect? auto reconnect?
        debugUnit("error in websocket: $o", evt);
        this.emit("error", evt);
        this.socketCleanup();
    };
    /**
     * Closes the connection to the unit.
     */
    close() {
        if (!this.client) {
            return;
        }
        debugUnit("closing connection by request");
        this.client.close();
    }
    socketCleanup = () => {
        debugUnit("socket cleanup");
        this.emit("close");
        this.client?.removeEventListener("error", this.onError);
        this.client?.removeEventListener("open", this.onOpen);
        this.client?.removeEventListener("close", this.socketCleanup);
        this.client?.removeEventListener("message", this.onClientMessage);
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
    heartbeat = () => {
        debugUnit("received heartbeat");
        clearTimeout(this.pingTimeout);
        this.pingTimeout = setTimeout(() => {
            debugUnit("terminating connection due to heartbeat timeout");
            this.emit("timeout");
            try {
                this.client?.close();
            }
            catch (ex) {
                debugUnit("exception trying to close client from ping timeout: %o", ex);
            }
            this.socketCleanup();
        }, this.pingInterval + 5000);
    };
    onClientMessage = (evt) => {
        const msg = evt.data;
        debugUnit("message received, length %d", msg.length);
        this.heartbeat();
        const respObj = JSON.parse(msg);
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
    async send(request) {
        if (!this.client) {
            return await new Promise(() => {
                throw new Error("client not connected");
            });
        }
        const payload = JSON.stringify(request);
        debugUnit("sending message of length %d with id %s", payload.length, request.messageID);
        this.client.send(payload);
        return await new Promise((resolve) => {
            this.once(`response-${request.messageID}`, (resp) => {
                debugUnit("  returning response to message %s", request.messageID);
                resolve(resp);
            });
        });
    }
}
exports.Unit = Unit;
//# sourceMappingURL=unit.js.map