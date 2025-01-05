"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetSetpoint = SetSetpoint;
const param_js_1 = require("./param.js");
const request_js_1 = require("./request.js");
/**
 * Requests to change the setpoint of a temperature circuit.
 *
 * Use the `objnam` of the circuit to be set and give the temperature in the same units that the
 * controller is set to (so, give a number in Celsius if the system is in Celsius or Fahrenheit
 * if the system is in Fahrenheit).
 *
 * @returns the object used to issue this request
 */
function SetSetpoint(objnam, setpoint) {
    const req = (0, request_js_1.GetRequest)();
    req.command = "SetParamList";
    req.objectList = [];
    const reqObj = new request_js_1.ICRequestObj();
    reqObj.objnam = objnam;
    reqObj.params = new param_js_1.ICParam();
    reqObj.params.LOTMP = setpoint.toString();
    req.objectList.push(reqObj);
    return req;
}
//# sourceMappingURL=setpoint.js.map