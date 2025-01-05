"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHeaters = GetHeaters;
const request_js_1 = require("./request.js");
/**
 * Requests the list of heaters known to this controller.
 *
 * The response contains an `objectList` populated with heater information.
 *
 * @returns the object used to issue this request
 */
function GetHeaters() {
    const req = (0, request_js_1.GetRequest)();
    req.command = "GetParamList";
    req.condition = "OBJTYP = HEATER";
    req.objectList = [];
    const reqObj = new request_js_1.ICRequestObj();
    reqObj.objnam = "ALL";
    reqObj.keys = [
        "OBJTYP: SUBTYP: SNAME: LISTORD: STATUS: PERMIT: TIMOUT: READY: HTMODE : SHOMNU : COOL : COMUART : BODY : HNAME : START : STOP : HEATING : BOOST : TIME : DLY : MODE",
    ];
    req.objectList.push(reqObj);
    return req;
}
//# sourceMappingURL=get-heater.js.map