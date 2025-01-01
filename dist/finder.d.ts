import * as dgram from "dgram";
import { EventEmitter } from "events";
export declare class FindUnits extends EventEmitter {
    constructor();
    private finder;
    private bound;
    private message;
    search(): void;
    searchAsync(searchTimeMs?: number): Promise<void>;
    foundServer(msg: Buffer, remote: dgram.RemoteInfo): void;
    sendServerBroadcast(): void;
    close(): void;
}
