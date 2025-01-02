import * as dgram from "dgram";
import { Socket } from "dgram";
import { EventEmitter } from "events";
import { setTimeout as setTimeoutSync } from "timers";
import os from "os";
import { GetDNSAnswer, GetDNSQuestion } from "./dns.js";

export class FindUnits extends EventEmitter {
  constructor() {
    super();

    const infs = os.networkInterfaces();
    const localIps: string[] = [];
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
    } else {
      localIp = localIps[0];
    }

    if (localIps.length > 1) {
      console.log(
        `found ${localIps.length.toString()} local IPs, using the first one for SSDP search (${localIp})`,
      );
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

  private finder: Socket;
  private bound = false;
  private message: Buffer;

  search() {
    if (!this.bound) {
      this.finder.bind();
    } else {
      this.sendServerBroadcast();
    }
  }

  public async searchAsync(searchTimeMs?: number): Promise<void> {
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

    return Promise.resolve(p) as Promise<void>;
  }

  foundServer(msg: Buffer, remote: dgram.RemoteInfo) {
    // debugFind("found something");

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
        const parsed = GetDNSQuestion(msg, nextQuestionOffset);
        nextQuestionOffset = parsed.endOffset;
      }

      nextAnswerOffset = nextQuestionOffset;
    }

    let answers = 0;
    if (msg.length >= 8) {
      answers = msg.readUInt16BE(6);
    }

    if (answers > 0) {
      for (let i = 0; i < answers; i++) {
        if (msg.length <= nextAnswerOffset) {
          console.error(
            `while inspecting dns answers, expected message length > ${nextAnswerOffset.toString()} but it was ${msg.length.toString()}`,
          );
          break;
        }

        const answer = GetDNSAnswer(msg, nextAnswerOffset);
        if (!answer) {
          break;
        }

        nextAnswerOffset = answer.endOffset;
        if (answer.interface === "a") {
          console.log("a record:", answer);
        }
      }
    }

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
    } else {
      //   debugFind("  unexpected message");
    }
  }

  sendServerBroadcast() {
    this.finder.send(this.message, 0, this.message.length, 5353, "224.0.0.251");
    // debugFind("Looking for IntelliCenter hosts...");
  }

  public close() {
    this.finder.close();
  }
}
