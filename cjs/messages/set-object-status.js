"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetObjectStatus = SetObjectStatus;
const param_js_1 = require("./param.js");
const request_js_1 = require("./request.js");
/**
 * Requests to change the status of objects known to this controller.
 *
 * Turns one or more objects on or off. Use the `objnam` of the circuit to be set.
 *
 * @returns the object used to issue this request
 */
function SetObjectStatus(object, status) {
    const req = (0, request_js_1.GetRequest)();
    req.command = "SetParamList";
    req.objectList = [];
    let objects;
    if (Array.isArray(object)) {
        objects = object;
    }
    else {
        objects = [object];
    }
    for (const i of objects) {
        const reqObj = new request_js_1.ICRequestObj();
        reqObj.objnam = i;
        reqObj.params = new param_js_1.ICParam();
        reqObj.params.STATUS = status ? "ON" : "OFF";
        req.objectList.push(reqObj);
    }
    return req;
}
//# sourceMappingURL=set-object-status.js.map