import { ICRequest } from "./request.js";
/**
 * Requests the status of chemical controllers known to this controller.
 *
 * The response contains the list of chemical controllers available in the `objectList` array.
 * For example, an IntelliChem may be one of the entries with `objnam` = `"CHM01"`, `params`.`OBJTYP`
 * = `"CHEM"`, `params`.`SUBTYP` = `"ICHEM"` while an IntelliChlor salt cell may be `objnam` = `"CHR01"`,
 * `params`.`OBJTYP` = `"CHEM"`, `params`.`SUBTYP` = `"ICHLOR"`. IntelliChlor knows the `"SALT"` level
 * while IntelliChem knows the `"PH"` values (PHTNK, PHSET, PHVAL), `"ORP"` values (ORPTNK, ORPSET, ORPVAL),
 * `"ALK"` (alkalinity), `"CALC"` (calcium hardness), and `"CYACID"` (cyanuric acid).
 *
 * pH and ORP Set and Val are in their respective units and orders of magnitude (e.g. 7.6, 750) while the TNK
 * levels seem to be on a scale of 1-7 (so "7" would be 100% full).
 *
 * @returns the object used to issue this request
 */
export declare function GetChemicalStatus(): ICRequest;
