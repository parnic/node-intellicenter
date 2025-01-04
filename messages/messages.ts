import { GetBodyStatus } from "./body-status.js";
import { GetChemicalStatus } from "./chem-status.js";
import { GetSystemConfiguration } from "./configuration.js";
import { GetHeaters } from "./get-heater.js";
import { GetSchedule } from "./schedule.js";
import { SetHeatMode } from "./set-heater.js";
import { SetItemStatus } from "./set-status.js";
import { SetSetpoint } from "./setpoint.js";
import { GetSystemInformation } from "./system-info.js";

export const messages = {
  GetBodyStatus,
  GetChemicalStatus,
  GetHeaters,
  GetSchedule,
  GetSystemConfiguration,
  GetSystemInformation,
  SetHeatMode,
  SetItemStatus,
  SetSetpoint,
};
