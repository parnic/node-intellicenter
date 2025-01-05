import { ICRequest } from "./request.js";
/**
 * Requests the list of circuits known to this controller.
 *
 * The response contains an `objectList` populated with circuit information.
 *
 * @returns the object used to issue this request
 */
export declare function GetCircuitStatus(): ICRequest;
