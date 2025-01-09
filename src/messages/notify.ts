import { GetRequest, ICRequest, ICRequestObj } from "./request.js";
// need to disable these lint warnings to allow the @link jsdoc to work
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ICParam } from "./param.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ICResponse } from "./response.js";

/**
 * Requests to subscribe for updates to the given keys.
 *
 * Keys and objnam should be given matching an objnam known to the controller and a key for that object.
 * {@linkcode ICParam} fields are the known list of keys available to subscribe to.
 *
 * The response contains an acknowledgement of success or failure. When the given keys change, the `Unit` will
 * emit a `"notify"` event with an {@linkcode ICResponse} payload for the new values.
 *
 * @param objnam the name of the object to subscribe to updates on
 * @param keys the key or list of keys to subscribe to updates on this object for
 * @returns the object used to issue this request
 */
export function SubscribeToUpdates(
  objnam: string,
  keys: string | string[],
): ICRequest {
  const req = GetRequest();
  req.command = "RequestParamList";
  req.objectList = [];

  let ks: string[];
  if (Array.isArray(keys)) {
    ks = keys;
  } else {
    ks = [keys];
  }

  const reqObj = new ICRequestObj();
  reqObj.objnam = objnam;
  reqObj.keys = ks;
  req.objectList.push(reqObj);

  return req;
}
