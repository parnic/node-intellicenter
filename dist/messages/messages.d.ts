import { GetBodyStatus } from "./body-status.js";
import { GetChemicalStatus } from "./chem-status.js";
import { GetSystemConfiguration } from "./configuration.js";
import { GetHeaters } from "./get-heater.js";
import { SetHeatMode } from "./set-heater.js";
import { SetItemStatus } from "./set-status.js";
import { SetSetpoint } from "./setpoint.js";
import { GetSystemInformation } from "./system-info.js";
export declare const messages: {
    GetBodyStatus: typeof GetBodyStatus;
    GetChemicalStatus: typeof GetChemicalStatus;
    GetHeaters: typeof GetHeaters;
    GetSystemConfiguration: typeof GetSystemConfiguration;
    GetSystemInformation: typeof GetSystemInformation;
    SetHeatMode: typeof SetHeatMode;
    SetItemStatus: typeof SetItemStatus;
    SetSetpoint: typeof SetSetpoint;
};
