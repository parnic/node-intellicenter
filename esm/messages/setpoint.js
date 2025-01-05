import { ICParam } from "./param.js";
import { GetRequest, ICRequestObj } from "./request.js";
/**
 * Requests to change the setpoint of a temperature circuit.
 *
 * Use the `objnam` of the circuit to be set and give the temperature in the same units that the
 * controller is set to (so, give a number in Celsius if the system is in Celsius or Fahrenheit
 * if the system is in Fahrenheit).
 *
 * @returns the object used to issue this request
 */
export function SetSetpoint(objnam, setpoint) {
    const req = GetRequest();
    req.command = "SetParamList";
    req.objectList = [];
    const reqObj = new ICRequestObj();
    reqObj.objnam = objnam;
    reqObj.params = new ICParam();
    reqObj.params.LOTMP = setpoint.toString();
    req.objectList.push(reqObj);
    return req;
}
//# sourceMappingURL=setpoint.js.map