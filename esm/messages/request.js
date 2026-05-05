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
    req.messageID = crypto.randomUUID();
    return req;
}
//# sourceMappingURL=request.js.map