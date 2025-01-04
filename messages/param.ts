export class ICParam {
  // "": "PROGRESS";
  public ABSMAX?: string;
  public ABSMIN?: string;
  public ACT?: string;
  public ACT1?: string;
  public ACT2?: string;
  public ACT3?: string;
  public ACT4?: string;
  public ADDRESS?: string;
  public ALK?: string;
  public AVAIL?: "AVAIL" | "ON" | "OFF";
  public BADGE?: string;
  public BODY?: string;
  public BOOST?: string;
  public CALC?: string;
  public CALIB?: string;
  public CHILD?: string;
  public CIRCUIT?: string;
  public CITY?: string;
  public CLK24A?: string;
  public COMUART?: string;
  public COOL?: string;
  public COOLING?: string;
  public COUNT?: string;
  public COUNTRY?: string;
  public CYACID?: string;
  public DAY?: string; // list of characters for each day. MTWRFAU: M=Monday, T=Tuesday, W=Wednesday, R=Thursday, F=Friday, A=Saturday, U=Sunday. could be empty to mean "no days assigned"
  public DLSTIM?: "DLSTIM" | "ON" | "OFF";
  public DLY?: string;
  public DNTSTP?: string;
  public EMAIL?: string;
  public EMAIL2?: string;
  public ENABLE?: "ENABLE" | "ON" | "OFF";
  public FEATR?: string;
  public FILTER?: string;
  public FREEZE?: string;
  public GPM?: string;
  public GROUP?: string;
  public HEATER?: string; // name of a heater circuit, e.g. "H0001". "00000" means unset/none. also seen to contain the string "HOLD" in some contexts such as when retrieving scheduling information.
  public HEATING?: "HEATING" | "ON" | "OFF";
  public HITMP?: string; // high temperature threshold in whatever units the system is set to. "78" means 78 degrees fahrenheit for a system in F, "30" means 30 degrees celsius for a system in C
  public HNAME?: string;
  public HTMODE?: string;
  public HTSRC?: string;
  public IN?: string;
  public LIMIT?: string;
  public LISTORD?: string; // sorting order. "2", "3", "4", etc.
  public LOCX?: string;
  public LOCY?: string;
  public LOTMP?: string;
  public LSTTMP?: string;
  public MANHT?: "MANHT" | "ON" | "OFF";
  public MANOVR?: "MANOVR" | "ON" | "OFF";
  public MANUAL?: string;
  public MAX?: string;
  public MAXF?: string;
  public MIN?: string;
  public MINF?: string;
  public MODE?: string; // seems to be a number, e.g. "0"
  public NAME?: string;
  public OBJLIST?: ICParam[];
  public OBJNAM?: string;
  public OBJTYP?: string;
  public OFFSET?: string;
  public ORPSET?: string;
  public ORPTNK?: string;
  public ORPVAL?: string;
  public PARENT?: string;
  public PARTY?: string;
  public PASSWRD?: string;
  public PERMIT?: string;
  public PHONE?: string;
  public PHONE2?: string;
  public PHSET?: string;
  public PHTNK?: string;
  public PHVAL?: string;
  public PRIM?: string;
  public PRIMFLO?: string;
  public PRIMTIM?: string;
  public PRIOR?: string;
  public PROBE?: string;
  public PROPNAME?: string;
  public PWR?: string;
  public QUALTY?: string;
  public READY?: string;
  public RLY?: string;
  public RPM?: string;
  public SALT?: string;
  public SEC?: string;
  public SELECT?: string;
  public SERVICE?: "SERVICE" | "AUTO" | "TIMEOUT";
  public SETTMP?: string;
  public SETTMPNC?: string;
  public SHARE?: string;
  public SHOMNU?: string;
  public SINDEX?: string;
  public SINGLE?: "SINGLE" | "ON" | "OFF";
  public SNAME?: string; // friendly name for a circuit, e.g. "Pool"
  public SOURCE?: string;
  public SMTSRT?: string; // stringified 16-bit bitfield, maybe? "65535"
  public SPEED?: string;
  public SRIS?: string;
  public SSET?: string;
  public START?: string; // seems to be very context-sensitive start value. sometimes a hint for how to interpret the TIME field ("ABSTIM"), other times as a single number ("6", in Heater response), and others as perhaps a date (in format "MM,DD,YY" where leading 0s are replaced with spaces, e.g. "12,30,24" vs " 1, 6,25")
  public STATE?: string;
  public STATIC?: string;
  public STATUS?: "STATUS" | "ON" | "OFF";
  public STOP?: string; // seems to be very context-sensitive stop value. sometimes a hint for how to interpret the TIME field ("ABSTIM"), other times as a single number ("3", in Heater response), and others as perhaps a date (in format "MM,DD,YY" where leading 0s are replaced with spaces, e.g. "12,30,24" vs " 1, 6,25")
  public SUBTYP?: string;
  public SUPER?: "SUPER" | "ON" | "OFF";
  public SWIM?: string;
  public SYNC?: string;
  public SYSTIM?: string;
  public TEMP?: string;
  public TIME?: string; // start time in "hh,mm,ss" format (24hr)
  public TIMOUT?: string; // seems to sometimes be end time in "hh,mm,ss" format (24hr), i guess that means "timeout" as in "time that this runs out" or something; other times a duration as number of seconds, e.g. "86400"
  public TIMZON?: string; // timezone offset from UTC, e.g. "-6"
  public UPDATE?: string; // seems to be a date in "MM/DD/YY" format
  public USAGE?: string;
  public USE?: string;
  public VACFLO?: "VACFLO" | "ON" | "OFF"; // vacation...flow?
  public VACTIM?: "VACTIM" | "ON" | "OFF"; // vacation time?
  public VALVE?: "VALVE" | "ON" | "OFF";
  public VER?: string;
  public VOL?: string;
  public ZIP?: string;
}
