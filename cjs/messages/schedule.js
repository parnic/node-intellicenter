"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSchedule = GetSchedule;
const request_js_1 = require("./request.js");
/**
 * Requests the list of schedules set on this controller.
 *
 * The response contains an `objectList` populated with schedule information.
 *
 * @returns the object used to issue this request
 */
function GetSchedule() {
    const req = (0, request_js_1.GetRequest)();
    req.command = "GetParamList";
    req.condition = "OBJTYP=SCHED";
    req.objectList = [];
    const reqObj = new request_js_1.ICRequestObj();
    reqObj.objnam = "ALL";
    reqObj.keys = [
        "OBJNAM : OBJTYP : LISTORD : CIRCUIT : SNAME : DAY : SINGLE : START : TIME : STOP : TIMOUT : GROUP : HEATER : COOLING : LOTMP : SMTSRT : STATUS : DNTSTP : ACT : MODE : AVAIL: VACFLO : VACTIM : UPDATE",
    ];
    req.objectList.push(reqObj);
    return req;
}
//# sourceMappingURL=schedule.js.map