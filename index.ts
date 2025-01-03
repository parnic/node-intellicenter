"use strict";

import { FindUnits } from "./finder.js";
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
  throw new Error(
    `found more than one IntelliCenter unit, unsure which one to use. ${JSON.stringify(units)}`,
  );
}

const endpoint = units[0].addressStr;
const port = units[0].port;

console.log("connecting to intellicenter device at", endpoint, "port", port);
const unit = new Unit(endpoint, port);
await unit.connect();
console.log("connected");
console.log("sending Get System Info request...");
const resp = await unit.getSystemInfo();
console.log("got response:", JSON.stringify(resp, null, 2));
unit.close();
