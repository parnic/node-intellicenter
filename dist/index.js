"use strict";
import { FindUnits } from "./finder.js";
import { GetBodyStatus } from "./messages/body-status.js";
import { GetSystemConfiguration } from "./messages/configuration.js";
// import { SetItemStatus } from "./messages/set-status.js";
import { GetSystemInfoRequest } from "./messages/system-info.js";
import { Unit } from "./unit.js";
console.log("searching...");
const f = new FindUnits();
const units = await f.searchAsync(1000);
f.close();
console.log("Discovered units:", units);
if (units.length === 0) {
    throw new Error("no IntelliCenter units found, exiting.");
}
if (units.length > 1) {
    throw new Error(`found more than one IntelliCenter unit, unsure which one to use. ${JSON.stringify(units)}`);
}
const endpoint = units[0].addressStr;
const port = units[0].port;
// const endpoint = "10.0.0.41";
// const port = 6680;
console.log("connecting to intellicenter device at", endpoint, "port", port);
const unit = new Unit(endpoint, port);
await unit.connect();
console.log("connected");
console.log("sending Get System Info request...");
let resp = await unit.send(GetSystemInfoRequest());
console.log("got response:", JSON.stringify(resp, null, 2));
console.log("sending Get System Config request...");
resp = await unit.send(GetSystemConfiguration());
console.log("got response:", JSON.stringify(resp, null, 2));
console.log("sending Get Body Status request...");
resp = await unit.send(GetBodyStatus());
console.log("got response:", JSON.stringify(resp, null, 2));
// console.log("turning off pool...");
// resp = await unit.send(SetItemStatus("B1101", false));
// console.log("got response:", JSON.stringify(resp, null, 2));
// console.log("turning off water feature...");
// resp = await unit.send(SetItemStatus("C0003", false));
// console.log("got response:", JSON.stringify(resp, null, 2));
unit.close();
//# sourceMappingURL=index.js.map