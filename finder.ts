import { createSocket, Socket } from "dgram";
import { EventEmitter } from "events";
import debug from "debug";

import {
  ARecord,
  GetDNSAnswer,
  GetDNSQuestion,
  ipToString,
  PtrRecord,
  Record,
  SrvRecord,
  TypePtr,
} from "./dns.js";

const debugFind = debug("ic:find");

export class UnitInfo {
  public name: string;
  public hostname: string;
  public port: number;
  public address: number;

  public get addressStr(): string {
    return ipToString(this.address);
  }

  public constructor(
    _name: string,
    _hostname: string,
    _port: number,
    _address: number,
  ) {
    this.name = _name;
    this.hostname = _hostname;
    this.port = _port;
    this.address = _address;
  }
}

export class FindUnits extends EventEmitter {
  constructor() {
    super();

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
    offset = this.message.writeUInt16BE(TypePtr, offset); // type
    this.message.writeUInt16BE(1, offset); // class: IN

    this.finder = createSocket("udp4");
    this.finder
      .on("listening", () => {
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

  private finder: Socket;
  private bound = false;
  private message: Buffer;
  private units: UnitInfo[] = [];

  /**
   * Begins a search and returns immediately. Must close the finder with close() when done with all searches.
   */
  public search() {
    if (!this.bound) {
      this.finder.bind();
    } else {
      this.sendServerBroadcast();
    }
  }

  /**
   * Searches for the given amount of time. Must close the finder with close() when done with all searches.
   * @param searchTimeMs the number of milliseconds to search before giving up and returning found results (default: 5000)
   * @returns Promise resolving to a list of discovered units, if any.
   */
  public async searchAsync(searchTimeMs?: number): Promise<UnitInfo[]> {
    const p = new Promise<UnitInfo[]>((resolve) => {
      setTimeout(() => {
        if (this.units.length === 0) {
          debugFind("No units found searching locally.");
        }

        this.removeAllListeners();
        resolve(this.units);
      }, searchTimeMs ?? 5000);

      this.on("serverFound", (unit: UnitInfo) => {
        debugFind("  found: %o", unit);
        this.units.push(unit);
      });

      this.search();
    });

    return p;
  }

  private foundServer(msg: Buffer) {
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

    const records: Record[] = [];
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

        records.push(answer);
        nextAnswerOffset = answer.endOffset;
      }
    }

    if (records.find((r) => r.name.startsWith("Pentair -i"))) {
      const srv = records.find((r) => r instanceof SrvRecord);
      const a = records.find((r) => r instanceof ARecord);
      if (!srv || !a) {
        return;
      }

      const unit = new UnitInfo(srv.name, a.name, srv.port, a.address);
      this.emit("serverFound", unit);
    } else {
      debugFind(
        "  found something that wasn't an IntelliCenter unit: %s",
        records
          .filter((r) => r instanceof PtrRecord)
          .map((r) => r.domain)
          .join(", "),
      );
    }
  }

  private sendServerBroadcast() {
    this.finder.send(this.message, 0, this.message.length, 5353, "224.0.0.251");
    debugFind("Looking for IntelliCenter hosts...");
  }

  /**
   * Closes the finder socket.
   */
  public close() {
    this.finder.close();
  }
}
