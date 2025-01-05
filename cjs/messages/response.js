"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICResponse = exports.ICResponseObj = void 0;
class ICResponseObj {
    objnam = "";
    params;
}
exports.ICResponseObj = ICResponseObj;
class ICResponse {
    command = "";
    messageID = "";
    response = "";
    objectList;
    queryName;
    answer;
    timeSince;
    timeNow;
}
exports.ICResponse = ICResponse;
//# sourceMappingURL=response.js.map