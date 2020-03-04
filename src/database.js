"use strict";
import { existsSync, mkdirSync } from "fs";
import level from "level";

const dbLocation = "db/" + (process.env.DB || process.env.P2P_PORT || 6001);
if (!existsSync("db/")) { mkdirSync("db/"); }
if (!existsSync(dbLocation)) { mkdirSync(dbLocation); }

const db = level(dbLocation);

export default {
    db
};
