import { ICParam } from "./param.js";
import { GetRequest, ICRequest, ICRequestObj } from "./request.js";

/**
 * Requests the status of bodies known to this controller.
 *
 * The response contains the list of bodies in the `params` field. Each body has
 * an `objnam` that should be used to reference that body for future requests.
 * When `params`.`STATUS` is `"OFF"`, use `params`.`LSTTMP` to get the temperature
 * of the body the last time it was on, or `params`.`TEMP` to get the temperature
 * if the `STATUS` is `"ON"`. `LSTTMP` seems to always be accurate, however, whether
 * the body is currently on or off.
 *
 * @returns the object used to issue this request
 */
export function SetItemStatus(item: string, status: boolean): ICRequest {
  const req = GetRequest();
  req.command = "SetParamList";
  req.objectList = [];

  const reqObj = new ICRequestObj();
  reqObj.objnam = item;
  reqObj.params = new ICParam();
  reqObj.params.STATUS = status ? "ON" : "OFF";
  req.objectList.push(reqObj);

  return req;
}
