import { ICParam } from "./param.js";

export class ICRequestObj {
  public objnam = "";
  public keys: string[] = [];
  public params?: ICParam;
}

export class ICRequest {
  public condition?: string;
  public objectList?: ICRequestObj[];
  public queryName?: string;
  public arguments?: string[] | string;
  public command = "";
  public messageID = "";
}

export function GetRequest(): ICRequest {
  const req = new ICRequest();
  req.messageID = crypto.randomUUID();
  return req;
}
