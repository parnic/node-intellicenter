export declare const TypeTxt = 16;
export declare const TypePtr = 12;
export declare const TypeSrv = 33;
export declare const TypeA = 1;
export declare class Question {
    name: string;
    type: number;
    class: number;
    endOffset: number;
    constructor(_name: string, _type: number, _cls: number, _endOffset: number);
}
export interface Record {
    interface: string | undefined;
    type: number;
    ttlSeconds: number;
    name: string;
    endOffset: number;
}
export interface PtrRecord extends Record {
    interface: "ptr";
    domain: string;
}
export interface TxtRecord extends Record {
    interface: "txt";
    text: string;
}
export interface SrvRecord extends Record {
    interface: "srv";
    priority: number;
    weight: number;
    port: number;
    target: string;
}
export interface ARecord extends Record {
    interface: "a";
    address: number;
    addressStr: string;
}
export declare function GetDNSQuestion(msg: Buffer, startOffset: number): Question;
export declare function GetDNSAnswer(msg: Buffer, startOffset: number): Record | undefined;
