import { ICParam } from "./param.js";
import { GetRequest, ICRequestObj } from "./request.js";
/**
 * Requests to change the status of items known to this controller.
 *
 * Turns one or more items on or off. Use the `objnam` of the circuit to be set.
 *
 * @returns the object used to issue this request
 */
export function SetItemStatus(item, status) {
    const req = GetRequest();
    req.command = "SetParamList";
    req.objectList = [];
    let items;
    if (Array.isArray(item)) {
        items = item;
    }
    else {
        items = [item];
    }
    for (const i of items) {
        const reqObj = new ICRequestObj();
        reqObj.objnam = i;
        reqObj.params = new ICParam();
        reqObj.params.STATUS = status ? "ON" : "OFF";
        req.objectList.push(reqObj);
    }
    return req;
}
//# sourceMappingURL=set-status.js.map