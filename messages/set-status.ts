import { ICParam } from "./param.js";
import { GetRequest, ICRequest, ICRequestObj } from "./request.js";

/**
 * Requests to change the status of items known to this controller.
 *
 * Turns one or more items on or off. Use the `objnam` of the circuit to be set.
 *
 * @returns the object used to issue this request
 */
export function SetItemStatus(
  item: string | string[],
  status: boolean,
): ICRequest {
  const req = GetRequest();
  req.command = "SetParamList";
  req.objectList = [];

  let items: string[];
  if (Array.isArray(item)) {
    items = item;
  } else {
    items = [item];
  }

  for (const i of items) {
    const reqObj = new ICRequestObj();
    reqObj.objnam = i;
    reqObj.params = new ICParam();
    reqObj.params.STATUS = status ? "ON" : "OFF";
    req.objectList.push(reqObj);
  }

  return req;
}
