import { GetRequest, ICRequest, ICRequestObj } from "./request.js";

export function GetSystemInfoRequest(): ICRequest {
  const req = GetRequest();
  req.command = "GETPARAMLIST";
  req.condition = "";
  req.objectList = [];

  const reqObj = new ICRequestObj();
  reqObj.objnam = "_5451";
  reqObj.keys = [
    "VER",
    "MODE",
    "ZIP",
    "TIMZON",
    "PROPNAME",
    "NAME",
    "ADDRESS",
    "CITY",
    "STATE",
    "PHONE",
    "PHONE2",
    "EMAIL",
    "EMAIL2",
    "COUNTRY",
    "PHONE",
    "LOCX",
    "LOCY",
    "AVAIL",
    "SERVICE",
    "UPDATE",
    "PROGRESS",
    "IN",
    "VALVE",
    "HEATING",
  ];
  req.objectList.push(reqObj);

  return req;
}
