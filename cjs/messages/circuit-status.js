"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCircuitStatus = GetCircuitStatus;
const request_js_1 = require("./request.js");
/**
 * Requests the list of circuits known to this controller.
 *
 * The response contains an `objectList` populated with circuit information.
 *
 * @returns the object used to issue this request
 */
function GetCircuitStatus() {
    const req = (0, request_js_1.GetRequest)();
    req.command = "GetParamList";
    req.condition = "OBJTYP = CIRCUIT";
    req.objectList = [];
    const reqObj = new request_js_1.ICRequestObj();
    reqObj.objnam = "ALL";
    reqObj.keys = [
        "OBJNAM",
        "OBJTYP",
        "SUBTYP",
        "STATUS",
        "BODY",
        "SNAME",
        "HNAME",
        "FREEZE",
        "DNTSTP",
        "HNAME",
        "TIME",
        "FEATR",
        "USAGE",
        "LIMIT",
        "USE",
        "SHOMNU",
    ];
    req.objectList.push(reqObj);
    return req;
}
//# sourceMappingURL=circuit-status.js.map