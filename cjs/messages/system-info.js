"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSystemInformation = GetSystemInformation;
const request_js_1 = require("./request.js");
/**
 * Requests information about this controller such as owner, address, etc.
 *
 * @returns the object used to issue this request
 */
function GetSystemInformation() {
    const req = (0, request_js_1.GetRequest)();
    req.command = "GETPARAMLIST";
    req.condition = "";
    req.objectList = [];
    const reqObj = new request_js_1.ICRequestObj();
    reqObj.objnam = "_5451";
    reqObj.keys = [
        "VER",
        "MODE",
        "ZIP",
        "TIMZON",
        "PROPNAME",
        "NAME",
        "ADDRESS",
        "CITY",
        "STATE",
        "PHONE",
        "PHONE2",
        "EMAIL",
        "EMAIL2",
        "COUNTRY",
        "PHONE",
        "LOCX",
        "LOCY",
        "AVAIL",
        "SERVICE",
        "UPDATE",
        "PROGRESS",
        "IN",
        "VALVE",
        "HEATING",
    ];
    req.objectList.push(reqObj);
    return req;
}
//# sourceMappingURL=system-info.js.map