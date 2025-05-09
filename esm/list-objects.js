import minimist from "minimist";
import { FindUnits, Unit } from "./index.js";
import { GetRequest, ICRequestObj } from "./messages/request.js";
const argv = minimist(process.argv.slice(2));
let endpoint = "";
let port = 6680;
if (typeof argv.controllerAddr === "string") {
    endpoint = argv.controllerAddr;
}
if (typeof argv.controllerPort === "number") {
    port = argv.controllerPort;
}
const example = async () => {
    if (!endpoint) {
        console.log("searching for units...");
        let multicastAddr;
        if (typeof argv.multicastAddr === "string") {
            multicastAddr = argv.multicastAddr;
        }
        const finder = new FindUnits(multicastAddr);
        const units = await finder.searchAsync(3000);
        finder.close();
        if (units.length === 0) {
            throw new Error("no IntelliCenter units found, exiting.");
        }
        if (units.length > 1) {
            throw new Error(`found more than one IntelliCenter unit, unsure which one to use. ${JSON.stringify(units)}`);
        }
        endpoint = units[0].addressStr;
        port = units[0].port;
        console.log(`...found unit at ${endpoint}:${port.toString()}`);
    }
    if (!endpoint) {
        throw new Error("invalid controller address");
    }
    console.log(`connecting to unit ${endpoint}:${port.toString()}...`);
    const unit = new Unit(endpoint, port);
    await unit.connect();
    console.log("...connected.");
    const customRequest = GetRequest();
    customRequest.command = "GetParamList";
    customRequest.condition = "";
    const reqObj = new ICRequestObj();
    reqObj.objnam = "ALL";
    reqObj.keys = ["OBJTYP", "SUBTYP", "SNAME", "STATUS"];
    customRequest.objectList = [reqObj];
    console.log("requesting object info...");
    const response = await unit.send(customRequest);
    console.log("...received.");
    console.log();
    let objects = response.objectList;
    if (argv.onlyToggleable) {
        objects = response.objectList?.filter((obj) => obj.params?.STATUS === "ON" || obj.params?.STATUS === "OFF");
    }
    if (!objects) {
        console.error("no objects found");
    }
    else {
        console.log("Found the following objects:");
        console.log(`[OBJNM][Type(/Subtype)] "Friendly Name": CURRENT_STATUS`);
        console.log("---------------------------------------");
        for (const obj of objects
            .filter((obj) => obj.params?.SNAME !== "SNAME")
            .map((obj) => `[${obj.objnam}][${obj.params?.OBJTYP ?? ""}${obj.params?.SUBTYP !== "SUBTYP" ? `/${obj.params?.SUBTYP ?? ""}` : ""}] "${obj.params?.SNAME ?? ""}": ${obj.params?.STATUS ?? ""}`)) {
            console.log(obj);
        }
    }
    unit.close();
};
example().catch((e) => {
    throw e;
});
//# sourceMappingURL=list-objects.js.map