"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaterType = void 0;
exports.SetHeatMode = SetHeatMode;
const param_js_1 = require("./param.js");
const request_js_1 = require("./request.js");
var HeaterType;
(function (HeaterType) {
    HeaterType[HeaterType["NoChange"] = 0] = "NoChange";
    HeaterType[HeaterType["Off"] = 1] = "Off";
    HeaterType[HeaterType["Heater"] = 2] = "Heater";
    HeaterType[HeaterType["SolarOnly"] = 3] = "SolarOnly";
    HeaterType[HeaterType["SolarPreferred"] = 4] = "SolarPreferred";
    HeaterType[HeaterType["UltraTemp"] = 5] = "UltraTemp";
    HeaterType[HeaterType["UltraTempPreferred"] = 6] = "UltraTempPreferred";
    HeaterType[HeaterType["HybridGas"] = 7] = "HybridGas";
    HeaterType[HeaterType["HybridUltraTemp"] = 8] = "HybridUltraTemp";
    HeaterType[HeaterType["HybridHybrid"] = 9] = "HybridHybrid";
    HeaterType[HeaterType["HybridDual"] = 10] = "HybridDual";
    HeaterType[HeaterType["MasterTemp"] = 11] = "MasterTemp";
    HeaterType[HeaterType["MaxETherm"] = 12] = "MaxETherm";
    HeaterType[HeaterType["ETI250"] = 13] = "ETI250";
})(HeaterType || (exports.HeaterType = HeaterType = {}));
/**
 * Requests to turn a body's heater on or off.
 *
 * Note that this doesn't necessarily start heating the body by itself - if the body's pump is
 * currently off, enabling the heater will not turn it on. If the pump/body is on, then this will
 * enable the heater and no further action is required.
 *
 * @returns the object used to issue this request
 */
function SetHeatMode(bodyObjnam, heaterType) {
    const req = (0, request_js_1.GetRequest)();
    req.command = "SetParamList";
    req.objectList = [];
    const reqObj = new request_js_1.ICRequestObj();
    reqObj.objnam = bodyObjnam;
    reqObj.params = new param_js_1.ICParam();
    reqObj.params.MODE = heaterType.toString();
    req.objectList.push(reqObj);
    return req;
}
//# sourceMappingURL=set-heater.js.map