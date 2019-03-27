'use strict';

function getCurrentTimestamp() {
    return Math.round(new Date().getTime() / 1000);
}

function getCurrentVersion() {
    const fs = require("fs");

    const packageJson = fs.readFileSync("./package.json");
    const currentVersion = JSON.parse(packageJson).version;
    return currentVersion;
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

module.exports = {
    getCurrentTimestamp,
    getCurrentVersion,
    hexToBinary
};
