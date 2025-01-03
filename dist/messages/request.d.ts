export declare class ICRequestObj {
    objnam: string;
    keys: string[];
}
export declare class ICRequest {
    condition?: string;
    objectList?: ICRequestObj[];
    queryName?: string;
    arguments?: string[] | string;
    command: string;
    messageID: string;
}
export declare function GetRequest(): ICRequest;
