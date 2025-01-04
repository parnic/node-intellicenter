import { EventEmitter } from "events";
import { WebSocket } from "ws";
export class Unit extends EventEmitter {
    endpoint;
    port;
    client;
    pingTimeout;
    constructor(endpoint, port = 6680) {
        super();
        this.endpoint = endpoint;
        this.port = port;
        this.endpoint = endpoint;
        this.port = port;
    }
    async connect() {
        if (this.client) {
            throw new Error("can't open a client that is already open");
        }
        this.client = new WebSocket(`ws://${this.endpoint}:${this.port.toString()}`);
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
    close() {
        this.client?.close();
    }
    heartbeat = () => {
        clearTimeout(this.pingTimeout);
        this.pingTimeout = setTimeout(() => {
            this.close();
        }, 30000 + 1000);
    };
    onClientMessage = (msg) => {
        const respObj = JSON.parse(msg.toString());
        if (respObj.command.toLowerCase() === "notifylist") {
            this.emit(`notify`, respObj);
        }
        this.emit(`response-${respObj.messageID}`, respObj);
    };
    async send(request) {
        this.client?.send(JSON.stringify(request));
        return await new Promise((resolve) => {
            this.once(`response-${request.messageID}`, (resp) => {
                resolve(resp);
            });
        });
    }
}
//# sourceMappingURL=unit.js.map