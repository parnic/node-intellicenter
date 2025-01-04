import { EventEmitter } from "events";
/**
 * Contains connection information for an IntelliCenter controller.
 */
export declare class UnitInfo {
    name: string;
    hostname: string;
    port: number;
    address: number;
    get addressStr(): string;
    constructor(_name: string, _hostname: string, _port: number, _address: number);
}
/**
 * Broadcasts mDNS packets to the local network to identify any Pentair IntelliCenter controllers connected to it.
 *
 * Available events:
 *
 * * `"close"` - fired when the search socket has closed
 * * `"error"` - fired when an unrecoverable error has occurred in the search socket
 * * `"serverFound"` - fired immediately when an IntelliCenter unit has been located; receives a {@linkcode UnitInfo} argument
 */
export declare class FindUnits extends EventEmitter {
    constructor();
    private finder;
    private bound;
    private message;
    private units;
    /**
     * Begins a search and returns immediately. Must close the finder with close() when done with all searches.
     * Subscribe to the `"serverFound"` event to receive connected unit information.
     */
    search(): void;
    /**
     * Searches for the given amount of time. Must close the finder with close() when done with all searches.
     *
     * @param searchTimeMs the number of milliseconds to search before giving up and returning found results (default: 5000)
     * @returns Promise resolving to a list of discovered {@linkcode UnitInfo}, if any.
     */
    searchAsync(searchTimeMs?: number): Promise<UnitInfo[]>;
    private foundServer;
    private sendServerBroadcast;
    /**
     * Closes the finder socket.
     */
    close(): void;
}
