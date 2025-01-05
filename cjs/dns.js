"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARecord = exports.SrvRecord = exports.TxtRecord = exports.PtrRecord = exports.Record = exports.Question = exports.TypeA = exports.TypeSrv = exports.TypePtr = exports.TypeTxt = void 0;
exports.ipToString = ipToString;
exports.GetDNSQuestion = GetDNSQuestion;
exports.GetDNSAnswer = GetDNSAnswer;
exports.TypeTxt = 16;
exports.TypePtr = 12;
exports.TypeSrv = 33;
exports.TypeA = 1;
class Question {
    name = "";
    type = 0;
    class = 0;
    endOffset = 0;
}
exports.Question = Question;
class Record {
    type = 0;
    ttlSeconds = 0;
    name = "";
    endOffset = -1;
}
exports.Record = Record;
class PtrRecord extends Record {
    domain = "";
}
exports.PtrRecord = PtrRecord;
class TxtRecord extends Record {
    text = "";
}
exports.TxtRecord = TxtRecord;
class SrvRecord extends Record {
    priority = 0;
    weight = 0;
    port = 0;
    target = "";
}
exports.SrvRecord = SrvRecord;
class ARecord extends Record {
    address = 0;
    get addressStr() {
        return ipToString(this.address);
    }
}
exports.ARecord = ARecord;
function ipToString(ip) {
    const o1 = (ip >> 24) & 0xff;
    const o2 = (ip >> 16) & 0xff;
    const o3 = (ip >> 8) & 0xff;
    const o4 = (ip >> 0) & 0xff;
    const addressStr = `${o1.toString()}.${o2.toString()}.${o3.toString()}.${o4.toString()}`;
    return addressStr;
}
class dnsAnswerParseResult {
    name = "";
    endOffset = 0;
}
function parseDnsName(msg, startOffset) {
    const result = new dnsAnswerParseResult();
    let offset = startOffset;
    while (offset < msg.length) {
        const nextByte = msg.readUInt8(offset);
        if (nextByte === 0) {
            offset++;
            break;
        }
        const pointerMask = (1 << 6) | (1 << 7);
        if ((nextByte & pointerMask) === pointerMask) {
            offset++;
            const pointerOffset = msg.readUInt8(offset);
            offset++;
            const nestedResult = parseDnsName(msg, pointerOffset);
            if (result.name.length > 0 && nestedResult.name.length > 0) {
                result.name += ".";
            }
            result.name += nestedResult.name;
            break;
        }
        offset++;
        const segment = msg.toString("ascii", offset, offset + nextByte);
        offset += nextByte;
        if (result.name.length > 0 && segment.length > 0) {
            result.name += ".";
        }
        result.name += segment;
    }
    result.endOffset = offset;
    return result;
}
function GetDNSQuestion(msg, startOffset) {
    let offset = startOffset;
    const parsedResult = parseDnsName(msg, offset);
    offset = parsedResult.endOffset;
    const type = msg.readUInt16BE(offset);
    offset += 2;
    const cls = msg.readUInt16BE(offset);
    offset += 2;
    const ret = new Question();
    ret.name = parsedResult.name;
    ret.type = type;
    ret.class = cls;
    ret.endOffset = offset;
    return ret;
}
function GetDNSAnswer(msg, startOffset) {
    let offset = startOffset;
    const parsedResult = parseDnsName(msg, offset);
    offset = parsedResult.endOffset;
    const type = msg.readUInt16BE(offset);
    offset += 2;
    offset += 2; // don't care about "class" of answer
    const ttlSeconds = msg.readUInt32BE(offset);
    offset += 4;
    const rDataLength = msg.readUInt16BE(offset);
    offset += 2;
    switch (type) {
        case exports.TypePtr: {
            const domainResult = parseDnsName(msg, offset);
            const ret = new PtrRecord();
            ret.type = type;
            ret.ttlSeconds = ttlSeconds;
            ret.name = parsedResult.name;
            ret.endOffset = offset + rDataLength;
            ret.domain = domainResult.name;
            return ret;
        }
        case exports.TypeTxt: {
            const textResult = parseDnsName(msg, offset);
            const ret = new TxtRecord();
            ret.type = type;
            ret.ttlSeconds = ttlSeconds;
            ret.name = parsedResult.name;
            ret.endOffset = offset + rDataLength;
            ret.text = textResult.name;
            return ret;
        }
        case exports.TypeSrv: {
            const priority = msg.readUInt16BE(offset);
            const weight = msg.readUInt16BE(offset + 2);
            const port = msg.readUInt16BE(offset + 4);
            const targetResult = parseDnsName(msg, offset + 6);
            const ret = new SrvRecord();
            ret.type = type;
            ret.ttlSeconds = ttlSeconds;
            ret.name = parsedResult.name;
            ret.endOffset = offset + rDataLength;
            ret.priority = priority;
            ret.weight = weight;
            ret.port = port;
            ret.target = targetResult.name;
            return ret;
        }
        case exports.TypeA: {
            const address = msg.readUInt32BE(offset);
            const ret = new ARecord();
            ret.type = type;
            ret.ttlSeconds = ttlSeconds;
            ret.name = parsedResult.name;
            ret.endOffset = offset + rDataLength;
            ret.address = address;
            return ret;
        }
        default:
            break;
    }
    return undefined;
}
//# sourceMappingURL=dns.js.map