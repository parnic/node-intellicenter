import { v4 as uuidv4 } from "uuid";
export class ICRequestObj {
    objnam = "";
    keys = [];
    params;
}
export class ICRequest {
    condition;
    objectList;
    queryName;
    arguments;
    command = "";
    messageID = "";
}
export function GetRequest() {
    const req = new ICRequest();
    req.messageID = uuidv4();
    return req;
}
//# sourceMappingURL=request.js.map