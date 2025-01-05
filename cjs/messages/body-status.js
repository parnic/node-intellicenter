"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBodyStatus = GetBodyStatus;
const request_js_1 = require("./request.js");
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
function GetBodyStatus() {
    const req = (0, request_js_1.GetRequest)();
    req.command = "GetParamList";
    req.condition = "OBJTYP = BODY";
    req.objectList = [];
    const reqObj = new request_js_1.ICRequestObj();
    reqObj.objnam = "ALL";
    reqObj.keys = [
        "OBJTYP: SUBTYP: SNAME: LISTORD: FILTER: LOTMP: TEMP: HITMP: HTSRC: PRIM: SEC: ACT1: ACT2: ACT3: ACT4: CIRCUIT: SPEED: BOOST: SELECT: STATUS: HTMODE : LSTTMP : HEATER : VOL : MANUAL : HNAME : MODE",
    ];
    req.objectList.push(reqObj);
    return req;
}
//# sourceMappingURL=body-status.js.map