import { Unit } from "../src/index.js";
import * as messages from "../src/messages/messages.js";
import * as WS from "jest-websocket-mock";
import { xdescribe, beforeEach, afterEach, it } from "@jest/globals";

function makeid(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  let result = "";
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
}

// temporarily disabled: as long as Unit uses the "ws" library, it is incompatible with the jest-websocket-mock server
xdescribe("basic message tests", () => {
  let unit: Unit;
  let mockServer: WS.WS;
  beforeEach(async () => {
    mockServer = new WS.WS("ws://localhost:6680");

    unit = new Unit("localhost", 6680);
    await unit.connect();
    await mockServer.connected;
  });

  afterEach(() => {
    unit.close();
    WS.WS.clean();
  });

  it("can send a message and return its response", async () => {
    const msg = messages.GetBodyStatus();
    const sender = unit.send(msg);
    await expect(mockServer).toReceiveMessage(JSON.stringify(msg));
    const response = { messageID: msg.messageID, command: makeid(8) };
    mockServer.send(JSON.stringify(response));
    const clientResp = await sender;
    expect(clientResp).toEqual(response);
  });
});
