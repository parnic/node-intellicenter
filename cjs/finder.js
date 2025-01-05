"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUnits = exports.UnitInfo = void 0;
const dgram_1 = require("dgram");
const events_1 = require("events");
const debug_1 = __importDefault(require("debug"));
const dns_js_1 = require("./dns.js");
const debugFind = (0, debug_1.default)("ic:find");
/**
 * Contains connection information for an IntelliCenter controller.
 */
class UnitInfo {
    name;
    hostname;
    port;
    address;
    get addressStr() {
        return (0, dns_js_1.ipToString)(this.address);
    }
    constructor(_name, _hostname, _port, _address) {
        this.name = _name;
        this.hostname = _hostname;
        this.port = _port;
        this.address = _address;
    }
}
exports.UnitInfo = UnitInfo;
/**
 * Broadcasts mDNS packets to the local network to identify any Pentair IntelliCenter controllers connected to it.
 *
 * Available events:
 *
 * * `"close"` - fired when the search socket has closed
 * * `"error"` - fired when an unrecoverable error has occurred in the search socket
 * * `"serverFound"` - fired immediately when an IntelliCenter unit has been located; receives a {@linkcode UnitInfo} argument
 */
class FindUnits extends events_1.EventEmitter {
    broadcastInterface;
    /**
     * Creates a new finder.
     *
     * @param broadcastInterface the address of the interface to send the broadcast to. If not specified, will use system selection. Only necessary if you have more than one network adapter/interface and want to search on a specific one.
     */
    constructor(broadcastInterface) {
        super();
        this.broadcastInterface = broadcastInterface;
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
        offset = this.message.writeUInt16BE(dns_js_1.TypePtr, offset); // type
        this.message.writeUInt16BE(1, offset); // class: IN
        this.finder = (0, dgram_1.createSocket)("udp4");
        this.finder
            .on("listening", () => {
            if (this.broadcastInterface) {
                this.finder.setMulticastInterface(this.broadcastInterface);
            }
            this.finder.setBroadcast(true);
            this.finder.setMulticastTTL(128);
            if (!this.bound) {
                this.bound = true;
                this.sendServerBroadcast();
            }
        })
            .on("message", (msg) => {
            this.foundServer(msg);
        })
            .on("close", () => {
            debugFind("Finder socket closed.");
            this.emit("close");
        })
            .on("error", (e) => {
            debugFind("Finder socket error: %O", e);
            this.emit("error", e);
        });
    }
    finder;
    bound = false;
    message;
    units = [];
    /**
     * Begins a search and returns immediately. Must close the finder with close() when done with all searches.
     * Subscribe to the `"serverFound"` event to receive connected unit information.
     */
    search() {
        if (!this.bound) {
            this.finder.bind();
        }
        else {
            this.sendServerBroadcast();
        }
    }
    /**
     * Searches for the given amount of time. Must close the finder with close() when done with all searches.
     *
     * @param searchTimeMs the number of milliseconds to search before giving up and returning found results (default: 5000)
     * @returns Promise resolving to a list of discovered {@linkcode UnitInfo}, if any.
     */
    async searchAsync(searchTimeMs) {
        const p = new Promise((resolve) => {
            setTimeout(() => {
                if (this.units.length === 0) {
                    debugFind("No units found searching locally.");
                }
                this.removeAllListeners();
                resolve(this.units);
            }, searchTimeMs ?? 5000);
            this.on("serverFound", (unit) => {
                debugFind("  found: %o", unit);
                this.units.push(unit);
            });
            this.search();
        });
        return p;
    }
    foundServer(msg) {
        let flags = 0;
        if (msg.length > 4) {
            flags = msg.readUInt16BE(2);
            const answerBit = 1 << 15;
            if ((flags & answerBit) === 0) {
                // received query, don't process as answer
                return;
            }
        }
        let nextAnswerOffset = 12;
        let questions = 0;
        if (msg.length >= 6) {
            questions = msg.readUInt16BE(4);
            let nextQuestionOffset = 12;
            for (let i = 0; i < questions; i++) {
                const parsed = (0, dns_js_1.GetDNSQuestion)(msg, nextQuestionOffset);
                nextQuestionOffset = parsed.endOffset;
            }
            nextAnswerOffset = nextQuestionOffset;
        }
        let answers = 0;
        if (msg.length >= 8) {
            answers = msg.readUInt16BE(6);
        }
        const records = [];
        if (answers > 0) {
            for (let i = 0; i < answers; i++) {
                if (msg.length <= nextAnswerOffset) {
                    console.error(`while inspecting dns answers, expected message length > ${nextAnswerOffset.toString()} but it was ${msg.length.toString()}`);
                    break;
                }
                const answer = (0, dns_js_1.GetDNSAnswer)(msg, nextAnswerOffset);
                if (!answer) {
                    break;
                }
                records.push(answer);
                nextAnswerOffset = answer.endOffset;
            }
        }
        if (records.find((r) => r.name.startsWith("Pentair -i"))) {
            const srv = records.find((r) => r instanceof dns_js_1.SrvRecord);
            const a = records.find((r) => r instanceof dns_js_1.ARecord);
            if (!srv || !a) {
                return;
            }
            const unit = new UnitInfo(srv.name, a.name, srv.port, a.address);
            this.emit("serverFound", unit);
        }
        else {
            debugFind("  found something that wasn't an IntelliCenter unit: %s", records
                .filter((r) => r instanceof dns_js_1.PtrRecord)
                .map((r) => r.domain)
                .join(", "));
        }
    }
    sendServerBroadcast() {
        this.finder.send(this.message, 0, this.message.length, 5353, "224.0.0.251");
        debugFind("Looking for IntelliCenter hosts...");
    }
    /**
     * Closes the finder socket.
     */
    close() {
        this.finder.close();
    }
}
exports.FindUnits = FindUnits;
//# sourceMappingURL=finder.js.map