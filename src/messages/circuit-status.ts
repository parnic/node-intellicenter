import { GetRequest, ICRequest, ICRequestObj } from "./request.js";

/**
 * Requests the list of circuits known to this controller.
 *
 * The response contains an `objectList` populated with circuit information.
 *
 * @returns the object used to issue this request
 */
export function GetCircuitStatus(): ICRequest {
  const req = GetRequest();
  req.command = "GetParamList";
  req.condition = "OBJTYP = CIRCUIT";
  req.objectList = [];

  const reqObj = new ICRequestObj();
  reqObj.objnam = "ALL";
  reqObj.keys = [
    "OBJNAM",
    "OBJTYP",
    "SUBTYP",
    "STATUS",
    "BODY",
    "SNAME",
    "HNAME",
    "FREEZE",
    "DNTSTP",
    "HNAME",
    "TIME",
    "FEATR",
    "USAGE",
    "LIMIT",
    "USE",
    "SHOMNU",
  ];
  req.objectList.push(reqObj);

  return req;
}
