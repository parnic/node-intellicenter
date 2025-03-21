import { ICRequest } from "./request.js";
export declare enum HeaterType {
    NoChange = 0,
    Off = 1,
    Heater = 2,
    SolarOnly = 3,
    SolarPreferred = 4,
    UltraTemp = 5,
    UltraTempPreferred = 6,
    HybridGas = 7,
    HybridUltraTemp = 8,
    HybridHybrid = 9,
    HybridDual = 10,
    MasterTemp = 11,
    MaxETherm = 12,
    ETI250 = 13
}
/**
 * Requests to turn a body's heater on or off.
 *
 * Note that this doesn't necessarily start heating the body by itself - if the body's pump is
 * currently off, enabling the heater will not turn it on. If the pump/body is on, then this will
 * enable the heater and no further action is required.
 *
 * @returns the object used to issue this request
 */
export declare function SetHeatMode(bodyObjnam: string, heaterType: HeaterType): ICRequest;
