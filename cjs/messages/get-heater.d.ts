import { ICRequest } from "./request.js";
/**
 * Requests the list of heaters known to this controller.
 *
 * The response contains an `objectList` populated with heater information.
 *
 * @returns the object used to issue this request
 */
export declare function GetHeaters(): ICRequest;
