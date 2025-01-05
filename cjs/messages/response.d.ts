import { ICParam } from "./param.js";
export declare class ICResponseObj {
    objnam: string;
    params?: ICParam;
}
export declare class ICResponse {
    command: string;
    messageID: string;
    response: string;
    objectList?: ICResponseObj[];
    queryName?: string;
    answer?: ICResponseObj[];
    timeSince?: string;
    timeNow?: string;
}
