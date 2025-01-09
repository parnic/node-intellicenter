import { ICParam } from "./param.js";
import { GetRequest, ICRequest, ICRequestObj } from "./request.js";

/**
 * Requests to change the status of objects known to this controller.
 *
 * Turns one or more objects on or off. Use the `objnam` of the circuit to be set.
 *
 * @returns the object used to issue this request
 */
export function SetObjectStatus(
  object: string | string[],
  status: boolean,
): ICRequest {
  const req = GetRequest();
  req.command = "SetParamList";
  req.objectList = [];

  let objects: string[];
  if (Array.isArray(object)) {
    objects = object;
  } else {
    objects = [object];
  }

  for (const i of objects) {
    const reqObj = new ICRequestObj();
    reqObj.objnam = i;
    reqObj.params = new ICParam();
    reqObj.params.STATUS = status ? "ON" : "OFF";
    req.objectList.push(reqObj);
  }

  return req;
}
