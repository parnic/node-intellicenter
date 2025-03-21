import { ICParam } from "./param.js";
import { GetRequest, ICRequest, ICRequestObj } from "./request.js";

export enum HeaterType {
  NoChange,
  Off,
  Heater,
  SolarOnly,
  SolarPreferred,
  UltraTemp,
  UltraTempPreferred,
  HybridGas,
  HybridUltraTemp,
  HybridHybrid,
  HybridDual,
  MasterTemp,
  MaxETherm,
  ETI250,
}

/**
 * Requests to turn a body's heater on or off.
 *
 * Note that this doesn't necessarily start heating the body by itself - if the body's pump is
 * currently off, enabling the heater will not turn it on. If the pump/body is on, then this will
 * enable the heater and no further action is required.
 *
 * @returns the object used to issue this request
 */
export function SetHeatMode(
  bodyObjnam: string,
  heaterType: HeaterType,
): ICRequest {
  const req = GetRequest();
  req.command = "SetParamList";
  req.objectList = [];

  const reqObj = new ICRequestObj();
  reqObj.objnam = bodyObjnam;
  reqObj.params = new ICParam();
  reqObj.params.MODE = heaterType.toString();
  req.objectList.push(reqObj);

  return req;
}
