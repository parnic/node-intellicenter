import { EventEmitter } from "events";
import { ICRequest } from "./messages/request.js";
import { ICResponse } from "./messages/response.js";
export declare class Unit extends EventEmitter {
    endpoint: string;
    port: number;
    private client?;
    private pingTimeout?;
    constructor(endpoint: string, port?: number);
    connect(): Promise<void>;
    close(): void;
    private heartbeat;
    private onClientMessage;
    send(request: ICRequest): Promise<ICResponse>;
}
