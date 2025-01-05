import { GetRequest, ICRequestObj } from "./request.js";
/**
 * Requests the list of heaters known to this controller.
 *
 * The response contains an `objectList` populated with heater information.
 *
 * @returns the object used to issue this request
 */
export function GetHeaters() {
    const req = GetRequest();
    req.command = "GetParamList";
    req.condition = "OBJTYP = HEATER";
    req.objectList = [];
    const reqObj = new ICRequestObj();
    reqObj.objnam = "ALL";
    reqObj.keys = [
        "OBJTYP: SUBTYP: SNAME: LISTORD: STATUS: PERMIT: TIMOUT: READY: HTMODE : SHOMNU : COOL : COMUART : BODY : HNAME : START : STOP : HEATING : BOOST : TIME : DLY : MODE",
    ];
    req.objectList.push(reqObj);
    return req;
}
//# sourceMappingURL=get-heater.js.map