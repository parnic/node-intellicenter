import { EventEmitter } from "events";
import { ICRequest } from "./messages/request.js";
import { ICResponse } from "./messages/response.js";
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
 */
export declare class Unit extends EventEmitter {
    endpoint: string;
    port: number;
    private client?;
    private pingTimeout?;
    private pingTimer?;
    private pingInterval;
    constructor(endpoint: string, port?: number);
    /**
     * Connects to the specified unit and maintains a connection to it until `close()` is called.
     */
    connect(): Promise<void>;
    /**
     * Closes the connection to the unit.
     */
    close(): void;
    private socketCleanup;
    private heartbeat;
    private onClientMessage;
    /**
     * Sends a request to the unit.
     *
     * @param request an message from {@linkcode messages} to send to the unit.
     * @returns a promise that resolves into the {@linkcode ICResponse} with information about the request.
     */
    send(request: ICRequest): Promise<ICResponse>;
}
