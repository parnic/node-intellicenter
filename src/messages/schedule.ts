import { GetRequest, ICRequest, ICRequestObj } from "./request.js";

/**
 * Requests the list of schedules set on this controller.
 *
 * The response contains an `objectList` populated with schedule information.
 *
 * @returns the object used to issue this request
 */
export function GetSchedule(): ICRequest {
  const req = GetRequest();
  req.command = "GetParamList";
  req.condition = "OBJTYP=SCHED";
  req.objectList = [];

  const reqObj = new ICRequestObj();
  reqObj.objnam = "ALL";
  reqObj.keys = [
    "OBJNAM : OBJTYP : LISTORD : CIRCUIT : SNAME : DAY : SINGLE : START : TIME : STOP : TIMOUT : GROUP : HEATER : COOLING : LOTMP : SMTSRT : STATUS : DNTSTP : ACT : MODE : AVAIL: VACFLO : VACTIM : UPDATE",
  ];
  req.objectList.push(reqObj);

  return req;
}
