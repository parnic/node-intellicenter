"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICRequest = exports.ICRequestObj = void 0;
exports.GetRequest = GetRequest;
const uuid_1 = require("uuid");
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
    req.messageID = (0, uuid_1.v4)();
    return req;
}
//# sourceMappingURL=request.js.map