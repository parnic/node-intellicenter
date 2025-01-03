import { v4 as uuidv4 } from "uuid";

export class ICRequestObj {
  public objnam = "";
  public keys: string[] = [];
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
  req.messageID = uuidv4();
  return req;
}
