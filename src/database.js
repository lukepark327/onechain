"use strict";
import level from "level";
import { join } from "path";

const dbPath = join(__dirname, "../db");
const db = level(dbPath);

export default {
    db
};
