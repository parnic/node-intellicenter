"use strict";

import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

// temp. replace with the IP of your device
const endpoint = "10.0.0.41";

let pingTimeout: ReturnType<typeof setTimeout>;

console.log("connecting to intellicenter device at", endpoint);
const client = new WebSocket(`ws://${endpoint}:6680`);

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

client.on("message", (msg: Buffer) => {
  const respObj = JSON.parse(msg.toString()); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  console.log(JSON.stringify(respObj, null, 2));
});
await new Promise((resolve, reject) => {
  client.once("error", reject);
  client.once("open", resolve);
}).then(() => {
  console.log("connected");
  console.log("sending request...");
  const req = {
    condition: "",
    objectList: [
      {
        objnam: "_5451",
        keys: [
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
        ],
      },
    ],
    command: "GETPARAMLIST",
    messageID: uuidv4(),
  };
  client.send(JSON.stringify(req));
  client.close();
});
