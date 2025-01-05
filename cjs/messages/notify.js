"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeToUpdates = SubscribeToUpdates;
const request_js_1 = require("./request.js");
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
function SubscribeToUpdates(objnam, keys) {
    const req = (0, request_js_1.GetRequest)();
    req.command = "RequestParamList";
    req.objectList = [];
    let ks;
    if (Array.isArray(keys)) {
        ks = keys;
    }
    else {
        ks = [keys];
    }
    const reqObj = new request_js_1.ICRequestObj();
    reqObj.objnam = objnam;
    reqObj.keys = ks;
    req.objectList.push(reqObj);
    return req;
}
//# sourceMappingURL=notify.js.map