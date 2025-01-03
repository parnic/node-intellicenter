"use strict";
import { WebSocket } from "ws";
import { FindUnits } from "./finder.js";
import { GetSystemInfoRequest } from "./messages/system-info.js";
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
let pingTimeout;
console.log("connecting to intellicenter device at", endpoint, "port", port);
const client = new WebSocket(`ws://${endpoint}:${port.toString()}`);
const heartbeat = () => {
    clearTimeout(pingTimeout);
    pingTimeout = setTimeout(() => {
        client.terminate();
    }, 30000 + 1000);
};
client.on("error", console.error);
client.on("open", heartbeat);
client.on("ping", heartbeat);
client.on("close", () => {
    clearTimeout(pingTimeout);
});
client.on("message", (msg) => {
    const respObj = JSON.parse(msg.toString());
    console.log(JSON.stringify(respObj, null, 2));
});
await new Promise((resolve, reject) => {
    client.once("error", reject);
    client.once("open", resolve);
}).then(() => {
    console.log("connected");
    console.log("sending request...");
    const req = GetSystemInfoRequest();
    client.send(JSON.stringify(req));
    client.close();
});
//# sourceMappingURL=index.js.map