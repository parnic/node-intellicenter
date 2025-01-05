"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("./index.js");
const messages = __importStar(require("./messages/messages.js"));
const example = async () => {
    console.log("searching...");
    const f = new index_js_1.FindUnits();
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
    const unit = new index_js_1.Unit(endpoint, port);
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
    console.log("sending Get Circuit Status request...");
    resp = await unit.send(messages.GetCircuitStatus());
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
};
example().catch((e) => {
    throw e;
});
//# sourceMappingURL=example.js.map