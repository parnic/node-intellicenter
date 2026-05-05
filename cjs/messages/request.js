"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICRequest = exports.ICRequestObj = void 0;
exports.GetRequest = GetRequest;
class ICRequestObj {
    objnam = "";
    keys = [];
    params;
}
exports.ICRequestObj = ICRequestObj;
class ICRequest {
    condition;
    objectList;
    queryName;
    arguments;
    command = "";
    messageID = "";
}
exports.ICRequest = ICRequest;
function GetRequest() {
    const req = new ICRequest();
    req.messageID = crypto.randomUUID();
    return req;
}
//# sourceMappingURL=request.js.map