import { ICRequest } from "./request.js";
/**
 * Requests the configuration of bodies and circuits available to this controller.
 *
 * The response contains the list of bodies and circuits under the `answer` field.
 * Each item has an `objnam` that should be used to reference that item for future requests,
 * and `params`.`SNAME` is the user-entered friendly name that can be displayed for the item.
 * `params`.`OBJTYP` will be either BODY or CIRCUIT depending on the item it's describing.
 *
 * Some items, such as the Pool body, will have the `params`.`OBJLIST` array populated with
 * a series of attached items such as a chlorinator device.
 *
 * @returns the object used to issue this request
 */
export declare function GetSystemConfiguration(): ICRequest;
