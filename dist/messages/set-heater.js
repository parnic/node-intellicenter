import { ICParam } from "./param.js";
import { GetRequest, ICRequestObj } from "./request.js";
/**
 * Requests to turn a body's heater on or off.
 *
 * This is very WIP. For my pool and my heater configuration, the MODE needs to be 11 to enable my
 * heater and 1 to disable all heaters. I have a feeling 11 is unique to my system's configuration,
 * but I can't yet determine how to know what 11 maps to in order to make this more generic.
 *
 * Note that this doesn't necessarily start heating the body by itself - if the body's pump is
 * currently off, enabling the heater will not turn it on. If the pump/body is on, then this will
 * enable the heater and no further action is required.
 *
 * @returns the object used to issue this request
 */
export function SetHeatMode(bodyObjnam, enabled) {
    const req = GetRequest();
    req.command = "SetParamList";
    req.objectList = [];
    const reqObj = new ICRequestObj();
    reqObj.objnam = bodyObjnam;
    reqObj.params = new ICParam();
    reqObj.params.MODE = enabled ? "11" : "1";
    req.objectList.push(reqObj);
    return req;
}
//# sourceMappingURL=set-heater.js.map