import { ICParam } from "./param.js";

export class ICResponseObj {
  public objnam = "";
  public params?: ICParam;
}

export class ICResponse {
  public command = "";
  public messageID = "";
  public response = "";
  public objectList?: ICResponseObj[];
  public queryName?: string;
  public answer?: ICResponseObj[];
  public timeSince?: string;
  public timeNow?: string;
}
