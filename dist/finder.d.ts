import { EventEmitter } from "events";
export declare class UnitInfo {
    name: string;
    hostname: string;
    port: number;
    address: number;
    get addressStr(): string;
    constructor(_name: string, _hostname: string, _port: number, _address: number);
}
export declare class FindUnits extends EventEmitter {
    constructor();
    private finder;
    private bound;
    private message;
    private units;
    /**
     * Begins a search and returns immediately. Must close the finder with close() when done with all searches.
     */
    search(): void;
    /**
     * Searches for the given amount of time. Must close the finder with close() when done with all searches.
     * @param searchTimeMs the number of milliseconds to search before giving up and returning found results (default: 5000)
     * @returns Promise resolving to a list of discovered units, if any.
     */
    searchAsync(searchTimeMs?: number): Promise<UnitInfo[]>;
    private foundServer;
    private sendServerBroadcast;
    /**
     * Closes the finder socket.
     */
    close(): void;
}
