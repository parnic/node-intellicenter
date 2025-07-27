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
    broadcastInterface?: string | undefined;
    /**
     * Creates a new finder.
     *
     * @param broadcastInterface the address of the interface to send the broadcast to. If not specified, will use system selection. Only necessary if you have more than one network adapter/interface and want to search on a specific one.
     */
    constructor(broadcastInterface?: string | undefined);
    private finder?;
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
     * Closes the finder socket. Finder is no longer usable after this.
     */
    close(): void;
}
