import { ICRequest } from "./request.js";
/**
 * Requests to change the status of items known to this controller.
 *
 * Turns one or more items on or off. Use the `objnam` of the circuit to be set.
 *
 * @returns the object used to issue this request
 */
export declare function SetItemStatus(item: string | string[], status: boolean): ICRequest;
