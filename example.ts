"use strict";

import { FindUnits, Unit } from "./index.js";
import { messages } from "./messages/messages.js";

console.log("searching...");
const f = new FindUnits("10.0.0.3");
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

// const endpoint = "10.0.0.41";
// const port = 6680;

console.log("connecting to intellicenter device at", endpoint, "port", port);
const unit = new Unit(endpoint, port);
await unit.connect();
console.log("connected");

unit.on("notify", (msg) => {
  console.log("received notify:", msg);
});

console.log("subscribing for updates...");
let resp = await unit.send(messages.SubscribeToUpdates("B1202", "LOTMP"));
console.log("got response:", JSON.stringify(resp, null, 2));

console.log("sending Get System Info request...");
resp = await unit.send(messages.GetSystemInformation());
console.log("got response:", JSON.stringify(resp, null, 2));

console.log("sending Get System Config request...");
resp = await unit.send(messages.GetSystemConfiguration());
console.log("got response:", JSON.stringify(resp, null, 2));

console.log("sending Get Body Status request...");
resp = await unit.send(messages.GetBodyStatus());
console.log("got response:", JSON.stringify(resp, null, 2));

console.log("sending Get Chemical Status request...");
resp = await unit.send(messages.GetChemicalStatus());
console.log("got response:", JSON.stringify(resp, null, 2));

console.log("sending Get Heaters request...");
resp = await unit.send(messages.GetHeaters());
console.log("got response:", JSON.stringify(resp, null, 2));

console.log("sending Get Schedule request...");
resp = await unit.send(messages.GetSchedule());
console.log("got response:", JSON.stringify(resp, null, 2));

// console.log("sending Set Setpoint request...");
// resp = await unit.send(messages.SetSetpoint("B1202", 97));
// console.log("got response:", JSON.stringify(resp, null, 2));

// console.log("turning off pool...");
// resp = await unit.send(messages.SetObjectStatus("B1101", false));
// console.log("got response:", JSON.stringify(resp, null, 2));

// console.log("turning off water feature...");
// resp = await unit.send(messages.SetObjectStatus("C0003", false));
// console.log("got response:", JSON.stringify(resp, null, 2));

// console.log("sending Set Heatmode request...");
// resp = await unit.send(messages.SetHeatMode("B1202", true));
// console.log("got response:", JSON.stringify(resp, null, 2));

unit.close();
