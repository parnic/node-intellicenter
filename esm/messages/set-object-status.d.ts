import { ICRequest } from "./request.js";
/**
 * Requests to change the status of objects known to this controller.
 *
 * Turns one or more objects on or off. Use the `objnam` of the circuit to be set.
 *
 * @returns the object used to issue this request
 */
export declare function SetObjectStatus(object: string | string[], status: boolean): ICRequest;
