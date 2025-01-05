"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSystemConfiguration = GetSystemConfiguration;
const request_js_1 = require("./request.js");
/**
 * Requests the configuration of bodies and circuits available to this controller.
 *
 * The response contains the list of bodies and circuits under the `answer` field.
 * Each object has an `objnam` that should be used to reference that object for future requests,
 * and `params`.`SNAME` is the user-entered friendly name that can be displayed for the object.
 * `params`.`OBJTYP` will be either BODY or CIRCUIT depending on the object it's describing.
 *
 * Some objects, such as the Pool body, will have the `params`.`OBJLIST` array populated with
 * a series of attached objects such as a chlorinator device.
 *
 * @returns the object used to issue this request
 */
function GetSystemConfiguration() {
    const req = (0, request_js_1.GetRequest)();
    req.command = "GetQuery";
    req.queryName = "GetConfiguration";
    req.arguments = "";
    return req;
}
//# sourceMappingURL=configuration.js.map