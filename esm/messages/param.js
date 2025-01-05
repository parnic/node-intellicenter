export class ICParam {
    // "": "PROGRESS";
    ABSMAX;
    ABSMIN;
    ACT;
    ACT1;
    ACT2;
    ACT3;
    ACT4;
    ADDRESS;
    ALK;
    AVAIL;
    BADGE;
    BODY;
    BOOST;
    CALC;
    CALIB;
    CHILD;
    CIRCUIT;
    CITY;
    CLK24A;
    COMUART;
    COOL;
    COOLING;
    COUNT;
    COUNTRY;
    CYACID;
    DAY; // list of characters for each day. MTWRFAU: M=Monday, T=Tuesday, W=Wednesday, R=Thursday, F=Friday, A=Saturday, U=Sunday. could be empty to mean "no days assigned"
    DLSTIM;
    DLY;
    DNTSTP;
    EMAIL;
    EMAIL2;
    ENABLE;
    FEATR;
    FILTER;
    FREEZE;
    GPM;
    GROUP;
    HEATER; // name of a heater circuit, e.g. "H0001". "00000" means unset/none. also seen to contain the string "HOLD" in some contexts such as when retrieving scheduling information.
    HEATING;
    HITMP; // high temperature threshold in whatever units the system is set to. "78" means 78 degrees fahrenheit for a system in F, "30" means 30 degrees celsius for a system in C
    HNAME;
    HTMODE;
    HTSRC;
    IN;
    LIMIT;
    LISTORD; // sorting order. "2", "3", "4", etc.
    LOCX;
    LOCY;
    LOTMP;
    LSTTMP;
    MANHT;
    MANOVR;
    MANUAL;
    MAX;
    MAXF;
    MIN;
    MINF;
    MODE; // seems to be a number, e.g. "0"
    NAME;
    OBJLIST;
    OBJNAM;
    OBJTYP;
    OFFSET;
    ORPSET;
    ORPTNK;
    ORPVAL;
    PARENT;
    PARTY;
    PASSWRD;
    PERMIT;
    PHONE;
    PHONE2;
    PHSET;
    PHTNK;
    PHVAL;
    PRIM;
    PRIMFLO;
    PRIMTIM;
    PRIOR;
    PROBE;
    PROPNAME;
    PWR;
    QUALTY;
    READY;
    RLY;
    RPM;
    SALT;
    SEC;
    SELECT;
    SERVICE;
    SETTMP;
    SETTMPNC;
    SHARE;
    SHOMNU;
    SINDEX;
    SINGLE;
    SNAME; // friendly name for a circuit, e.g. "Pool"
    SOURCE;
    SMTSRT; // stringified 16-bit bitfield, maybe? "65535"
    SPEED;
    SRIS;
    SSET;
    START; // seems to be very context-sensitive start value. sometimes a hint for how to interpret the TIME field ("ABSTIM"), other times as a single number ("6", in Heater response), and others as perhaps a date (in format "MM,DD,YY" where leading 0s are replaced with spaces, e.g. "12,30,24" vs " 1, 6,25")
    STATE;
    STATIC;
    STATUS; // seen values for this: "STATUS", "ON", "OFF", "OK", and numbers ("4", "1", etc.);
    STOP; // seems to be very context-sensitive stop value. sometimes a hint for how to interpret the TIME field ("ABSTIM"), other times as a single number ("3", in Heater response), and others as perhaps a date (in format "MM,DD,YY" where leading 0s are replaced with spaces, e.g. "12,30,24" vs " 1, 6,25")
    SUBTYP;
    SUPER;
    SWIM;
    SYNC;
    SYSTIM;
    TEMP;
    TIME; // start time in "hh,mm,ss" format (24hr)
    TIMOUT; // seems to sometimes be end time in "hh,mm,ss" format (24hr), i guess that means "timeout" as in "time that this runs out" or something; other times a duration as number of seconds, e.g. "86400"
    TIMZON; // timezone offset from UTC, e.g. "-6"
    UPDATE; // seems to be a date in "MM/DD/YY" format
    USAGE;
    USE;
    VACFLO; // vacation...flow?
    VACTIM; // vacation time?
    VALVE;
    VER;
    VOL;
    ZIP;
}
//# sourceMappingURL=param.js.map