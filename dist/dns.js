export const TypeTxt = 16;
export const TypePtr = 12;
export const TypeSrv = 33;
export const TypeA = 1;
export class Question {
    name = "";
    type = 0;
    class = 0;
    endOffset = 0;
    constructor(_name, _type, _cls, _endOffset) {
        this.name = _name;
        this.type = _type;
        this.class = _cls;
        this.endOffset = _endOffset;
    }
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
export function GetDNSQuestion(msg, startOffset) {
    let offset = startOffset;
    const parsedResult = parseDnsName(msg, offset);
    offset = parsedResult.endOffset;
    const type = msg.readUInt16BE(offset);
    offset += 2;
    const cls = msg.readUInt16BE(offset);
    offset += 2;
    return new Question(parsedResult.name, type, cls, offset);
}
export function GetDNSAnswer(msg, startOffset) {
    let offset = startOffset;
    const parsedResult = parseDnsName(msg, offset);
    offset = parsedResult.endOffset;
    const type = msg.readUInt16BE(offset);
    offset += 2;
    offset += 2; // don't care about "class" of answer
    const ttlSeconds = msg.readUInt32BE(offset);
    offset += 4;
    const remainingDataLength = msg.readUInt16BE(offset);
    offset += 2;
    switch (type) {
        case TypePtr: {
            const domainResult = parseDnsName(msg, offset);
            const ret = {
                interface: "ptr",
                type: type,
                ttlSeconds: ttlSeconds,
                name: parsedResult.name,
                endOffset: offset + remainingDataLength,
                domain: domainResult.name,
            };
            return ret;
        }
        case TypeTxt: {
            const textResult = parseDnsName(msg, offset);
            const ret = {
                interface: "txt",
                type: type,
                ttlSeconds: ttlSeconds,
                name: parsedResult.name,
                endOffset: offset + remainingDataLength,
                text: textResult.name,
            };
            return ret;
        }
        case TypeSrv: {
            const priority = msg.readUInt16BE(offset);
            offset += 2;
            const weight = msg.readUInt16BE(offset);
            offset += 2;
            const port = msg.readUInt16BE(offset);
            offset += 2;
            const targetResult = parseDnsName(msg, offset);
            offset = targetResult.endOffset;
            const ret = {
                interface: "srv",
                type: type,
                ttlSeconds: ttlSeconds,
                name: parsedResult.name,
                endOffset: offset,
                priority: priority,
                weight: weight,
                port: port,
                target: targetResult.name,
            };
            return ret;
        }
        case TypeA: {
            const o1 = msg.readUInt8(offset);
            offset++;
            const o2 = msg.readUInt8(offset);
            offset++;
            const o3 = msg.readUInt8(offset);
            offset++;
            const o4 = msg.readUInt8(offset);
            offset++;
            const address = `${o1.toString()}.${o2.toString()}.${o3.toString()}.${o4.toString()}`;
            const ret = {
                interface: "a",
                type: type,
                ttlSeconds: ttlSeconds,
                name: parsedResult.name,
                endOffset: offset + remainingDataLength,
                address: address,
            };
            return ret;
        }
        default:
            break;
    }
    return undefined;
}
//# sourceMappingURL=dns.js.map