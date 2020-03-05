'use strict';
import { cloneDeep } from "lodash";
import { existsSync, mkdirSync, readFileSync } from "fs";

function deepCopy(src) {
    return cloneDeep(src);
}

function deepEqual(value, other) {
    // return _.isEqual(value, other); // Can not get rid of functions.
    return JSON.stringify(value) === JSON.stringify(other);
}

function recursiveMkdir(path) {
    var pathSplited = path.split('/');
    var tempPath = '';
    for (var i = 0; i < pathSplited.length; i++) {
        tempPath += (pathSplited[i] + '/');
        if (!existsSync(tempPath)) { mkdirSync(tempPath); }
    }
}

function hexToBinary(s) {
    const lookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011',
        '4': '0100', '5': '0101', '6': '0110', '7': '0111',
        '8': '1000', '9': '1001', 'A': '1010', 'B': '1011',
        'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111'
    };

    var ret = "";
    for (var i = 0; i < s.length; i++) {
        if (lookupTable[s[i]]) { ret += lookupTable[s[i]]; }
        else { return null; }
    }
    return ret;
}

function getCurrentTimestamp() {
    return Math.round(new Date().getTime() / 1000);
}

function getCurrentVersion() {
    const packageJson = readFileSync("./package.json");
    const currentVersion = JSON.parse(packageJson).version;
    return currentVersion;
}

export default {
    deepCopy,
    deepEqual,
    recursiveMkdir,
    hexToBinary,
    getCurrentTimestamp,
    getCurrentVersion
};
