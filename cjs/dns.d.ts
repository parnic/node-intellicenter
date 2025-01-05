export declare const TypeTxt = 16;
export declare const TypePtr = 12;
export declare const TypeSrv = 33;
export declare const TypeA = 1;
export declare class Question {
    name: string;
    type: number;
    class: number;
    endOffset: number;
}
export declare abstract class Record {
    type: number;
    ttlSeconds: number;
    name: string;
    endOffset: number;
}
export declare class PtrRecord extends Record {
    domain: string;
}
export declare class TxtRecord extends Record {
    text: string;
}
export declare class SrvRecord extends Record {
    priority: number;
    weight: number;
    port: number;
    target: string;
}
export declare class ARecord extends Record {
    address: number;
    get addressStr(): string;
}
export declare function ipToString(ip: number): string;
export declare function GetDNSQuestion(msg: Buffer, startOffset: number): Question;
export declare function GetDNSAnswer(msg: Buffer, startOffset: number): Record | undefined;
