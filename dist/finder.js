import * as dgram from "dgram";
import { EventEmitter } from "events";
import { setTimeout as setTimeoutSync } from "timers";
import os from "os";
export class FindUnits extends EventEmitter {
    constructor() {
        super();
        const infs = os.networkInterfaces();
        const localIps = [];
        let localIp = "127.0.0.1";
        Object.keys(infs).forEach((key) => {
            infs[key]?.forEach((iface) => {
                if (iface.internal) {
                    return;
                }
                if (iface.family !== "IPv4") {
                    return;
                }
                localIps.push(iface.address);
            });
        });
        if (localIps.length === 0) {
            console.error(`no local interfaces found, can't search for controllers.`);
            // todo: emit error
        }
        else {
            localIp = localIps[0];
        }
        if (localIps.length > 1) {
            console.log(`found ${localIps.length.toString()} local IPs, using the first one for SSDP search (${localIp})`);
        }
        // construct mDNS packet to ping for intellicenter controllers
        this.message = Buffer.alloc(34);
        let offset = 0;
        offset = this.message.writeUInt16BE(0, offset); // transaction id
        offset = this.message.writeUInt16BE(0, offset); // flags: 0x0 (standard query)
        offset = this.message.writeUInt16BE(1, offset); // asking 1 question
        offset = this.message.writeUInt16BE(0, offset); // answer rr
        offset = this.message.writeUInt16BE(0, offset); // authority rr
        offset = this.message.writeUInt16BE(0, offset); // additional rr
        offset = this.message.writeUInt8("_http".length, offset);
        offset += this.message.write("_http", offset);
        offset = this.message.writeUInt8("_tcp".length, offset);
        offset += this.message.write("_tcp", offset);
        offset = this.message.writeUInt8("local".length, offset);
        offset += this.message.write("local", offset);
        offset = this.message.writeUInt8(0, offset); // no more strings
        offset = this.message.writeUInt16BE(0x000c, offset); // type: ptr
        this.message.writeUInt16BE(1, offset); // class: IN
        this.finder = dgram.createSocket("udp4");
        this.finder
            .on("listening", () => {
            this.finder.setBroadcast(true);
            this.finder.setMulticastTTL(128);
            if (!this.bound) {
                this.bound = true;
                this.sendServerBroadcast();
            }
        })
            .on("message", (msg, remote) => {
            this.foundServer(msg, remote);
        })
            .on("close", () => {
            // debugFind("closed");
            console.log("closed");
            this.emit("close");
        })
            .on("error", (e) => {
            // debugFind("error: %O", e);
            console.log("errored");
            this.emit("error", e);
        });
    }
    finder;
    bound = false;
    message;
    search() {
        if (!this.bound) {
            this.finder.bind();
        }
        else {
            this.sendServerBroadcast();
        }
    }
    async searchAsync(searchTimeMs) {
        const p = new Promise((resolve) => {
            // debugFind("IntelliCenter finder searching for local units...");
            setTimeoutSync(() => {
                //   if (units.length === 0) {
                //     debugFind("No units found searching locally.");
                //   }
                this.removeAllListeners();
                resolve(0);
            }, searchTimeMs ?? 5000);
            this.on("serverFound", () => {
                //   debugFind(`IntelliCenter found unit ${JSON.stringify(unit)}`);
                console.log("found");
                //   units.push(unit);
            });
            this.search();
        });
        return Promise.resolve(p);
    }
    foundServer(msg, remote) {
        // debugFind("found something");
        const str = msg.toString();
        console.log(str);
        if (msg.length >= 40) {
            const server = {
                address: remote.address,
                type: msg.readInt32LE(0),
                port: msg.readInt16LE(8),
                gatewayType: msg.readUInt8(10),
                gatewaySubtype: msg.readUInt8(11),
                gatewayName: msg.toString("utf8", 12, 29),
            };
            //   debugFind(
            //     "  type: " +
            //       server.type +
            //       ", host: " +
            //       server.address +
            //       ":" +
            //       server.port +
            //       ", identified as " +
            //       server.gatewayName,
            //   );
            if (server.type === 2) {
                this.emit("serverFound", server);
            }
        }
        else {
            //   debugFind("  unexpected message");
        }
    }
    sendServerBroadcast() {
        this.finder.send(this.message, 0, this.message.length, 5353, "224.0.0.251");
        // debugFind("Looking for IntelliCenter hosts...");
    }
    close() {
        this.finder.close();
    }
}
//# sourceMappingURL=finder.js.map